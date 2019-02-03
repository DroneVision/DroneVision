import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import wait from 'waait';
import commandDelays from '../drone/commandDelays';

import {
  Button,
  Icon,
  List,
  Segment,
  Header,
  Grid,
  Image,
} from 'semantic-ui-react';

import ButtonPanel from '../components/ButtonPanel';
import BuildCanvas from '../components/BuildCanvas';
import {
  changeTab,
  updateInstructions,
  clearInstructions,
  updateCDP,
  toggleObstacles,
  updateDroneConnectionStatus,
  rotateDrone,
} from '../store/store';

import { drawPath, getDroneCoords } from '../utils/drawPathUtils';

const { ipcRenderer } = window.require('electron');

class Build extends Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.state = {
      limits: {
        maxX: scale / 2,
        maxY: scale,
        maxZ: scale / 2,
        minX: -scale / 2,
        minY: 1,
        minZ: -scale / 2,
      },
      startingPoint: { x: 0, y: 1, z: 0 },
      runButtonsDisabled: false,
    };
  }

  componentDidMount() {
    // Listen for flight import from main process
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
    });
    // Listen for request for flight instructions from main process
    ipcRenderer.on('request-flightInstructions', event => {
      // Reply back with instructions
      ipcRenderer.send(
        'send-flightInstructions',
        this.props.flightInstructions
      );
    });
    ipcRenderer.on('drone-connection', (event, droneConnectionStatus) => {
      this.props.updateDroneConnectionStatus(droneConnectionStatus);
      // Send a command to drone
      ipcRenderer.send('single-instruction', 'command');
    });
  }

  addFlightInstruction = instructionObj => {
    const { flightInstructions, speed, distance } = this.props;
    const {
      droneInstruction: newDroneInstruction,
      drawInstruction: newDrawInstruction,
      message: newFlightMessage,
    } = instructionObj;
    const lastInstructionObj =
      flightInstructions[flightInstructions.length - 2];
    const {
      droneInstruction: lastDroneInstruction,
      drawInstruction: lastDrawInstruction,
      message: lastMessage,
    } = lastInstructionObj;

    const lastMessageName = lastMessage
      .split(' ')
      .slice(0, -3)
      .join(' ');

    const lastDroneInstructionArr = lastDroneInstruction.split(' ');
    const lastSpeed = Number(
      lastDroneInstructionArr[lastDroneInstructionArr.length - 1]
    );

    const flightInstructionObj = {};

    let updatedFlightInstructions = flightInstructions.slice();
    if (newFlightMessage === lastMessageName && speed === lastSpeed) {
      // Redundant instruction, so just adjust the last one's values
      if (newDroneInstruction === 'hold') {
        // TODO: add logic for hold
      } else {
        //Updating drone instruction
        const lastDroneInstructionCoords = lastDroneInstruction
          .split(' ')
          .slice(1, 4);
        console.log('newdroneinstruction', newDroneInstruction);
        const resultDroneCoords = lastDroneInstructionCoords.map(
          (coord, idx) => {
            return Number(coord) + newDroneInstruction[idx] * distance * 100;
          }
        );
        const updatedDroneInstruction = `go ${resultDroneCoords.join(
          ' '
        )} ${speed}`;
        flightInstructionObj.droneInstruction = updatedDroneInstruction;

        //Updating draw instruction
        const newDrawCoords = lastDrawInstruction.map(
          (coord, idx) => coord + newDrawInstruction[idx]
        );
        flightInstructionObj.drawInstruction = newDrawCoords;

        //Updating instruction message
        const lastDistance = Number(lastMessage.split(' ').slice(-2, -1)[0]);
        const resultDistance = lastDistance + distance;
        const newMessage = `${newFlightMessage} --> ${resultDistance.toFixed(
          1
        )} m`;
        flightInstructionObj.message = newMessage;
      }
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      flightInstructionObj.droneInstruction = `go ${newDroneInstruction
        .map(numStr => Number(numStr) * distance * 100)
        .join(' ')} ${speed}`;
      flightInstructionObj.drawInstruction = newDrawInstruction;
      flightInstructionObj.message = `${newFlightMessage} --> ${distance} m`;
      //New flight instruction (non-duplicate), so add it in
      updatedFlightInstructions.splice(-1, 0, flightInstructionObj);
    }
    this.props.updateInstructions(updatedFlightInstructions);
  };

  addRotationInstruction = (direction, degs = 90) => {
    const { flightInstructions, droneOrientation } = this.props;
    const lastInstructionObj =
      flightInstructions[flightInstructions.length - 2];

    const { droneInstruction: lastDroneInstruction } = lastInstructionObj;

    const newMessage =
      direction === 'cw' ? `Rotate Clockwise` : `Rotate Counter-Clockwise`;

    const flightInstructionObj = {};

    let updatedFlightInstructions = flightInstructions.slice();

    const lastDroneInstructionArr = lastDroneInstruction.split(' ');

    if (direction === lastDroneInstructionArr[0]) {
      const oldDegs = lastDroneInstructionArr[1];
      const resultDegs = degs + Number(oldDegs);
      flightInstructionObj.droneInstruction = `${direction} ${resultDegs}`;
      flightInstructionObj.message = `${newMessage} --> ${resultDegs} degrees`;
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      flightInstructionObj.droneInstruction = `${direction} ${degs}`;
      flightInstructionObj.message = `${newMessage} --> ${degs} degrees`;
      //New flight instruction (non-duplicate), so add it in
      updatedFlightInstructions.splice(-1, 0, flightInstructionObj);
    }
    this.props.updateInstructions(updatedFlightInstructions);

    let newOrientation;
    if (direction === 'cw') {
      newOrientation = (droneOrientation + 1) % 4;
    } else {
      //counter-clockwise
      newOrientation = (droneOrientation + 3) % 4;
    }
    this.props.rotateDrone(newOrientation);
  };

  deleteLastInstruction = () => {
    const { flightInstructions, distance, droneOrientation } = this.props;
    let updatedFlightInstructions = flightInstructions.slice();

    const removedInstruction = updatedFlightInstructions.splice(-2, 1);

    //TODO: update droneRotation if the last instruction was a rotation
    const [command, amount] = removedInstruction[0].droneInstruction.split(' ');

    if (command === 'cw') {
      const newOrientation =
        (droneOrientation + (3 + Number(amount) / 90 - 1)) % 4;
      this.props.rotateDrone(newOrientation);
    } else if (command === 'ccw') {
      //counter-clockwise
      const newOrientation =
        (droneOrientation + (1 + Number(amount) / 90 - 1)) % 4;
      this.props.rotateDrone(newOrientation);
    }

    this.props.updateInstructions(updatedFlightInstructions);
  };

  clearFlightInstructions = () => {
    this.props.rotateDrone(0);
    this.props.clearInstructions();
  };

  getCurrentPoint = flightCoords => {
    const currentPoint = flightCoords.reduce(
      (currentPoint, item) => {
        const [z, x, y] = item;
        currentPoint.x = currentPoint.x + x;
        currentPoint.y = currentPoint.y + y;
        currentPoint.z += currentPoint.z = z;
        return currentPoint;
      },
      { ...this.props.startingPosition }
    );
    return currentPoint;
  };

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //Iterate over all flightInstructions
    for (let i = 0; i < flightInstructions.length; i++) {
      let flightInstruction = flightInstructions[i];
      let instructionName = flightInstruction.droneInstruction.split(' ')[0];
      //create new object for new coordinates
      let newCoords = {};
      let flightInstructionArray = flightInstruction.droneInstruction
        .split(' ')
        .slice(1, 4)
        .map(numStr => Number(numStr) / this.props.distance);

      const [z, x, y] = flightInstructionArray;
      // x -> z
      // y -> x
      // z -> y
      newCoords.x = this.props.currentDronePosition.x + x;
      newCoords.y = this.props.currentDronePosition.y + y;
      newCoords.z = this.props.currentDronePosition.z + z;
      console.log('instruction: ', instructionName);
      if (instructionName === 'command') {
      } else if (instructionName === 'takeoff') {
        this.props.updateCDP({
          x: this.props.startingPosition.x,
          y: this.props.startingPosition.y + 1,
          z: this.props.startingPosition.z,
        });
      } else if (instructionName === 'land') {
        this.props.updateCDP({
          x: this.props.currentDronePosition.x,
          y: 0 + this.props.voxelSize * -0.5,
          z: this.props.currentDronePosition.z,
        });

        setTimeout(() => {
          //After flight completes wait 10 seconds
          //Send drone model back to starting position
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });
          //Give the 'Send drone model back to starting
          //position 4.5 seconds to animate before re-enabling buttons
          setTimeout(() => {
            this.setState({ runButtonsDisabled: false });
          }, 4500);
        }, 10000);
      } else {
        this.props.updateCDP(newCoords);
      }
      //Wait for Command Delay
      await wait(commandDelays[instructionName]);
    }
  };

  preVisualizePath = () => {
    //Diable Buttons
    this.setState({ runButtonsDisabled: true });
    //Prepare variables for flight
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  render() {
    const { limits } = this.state;
    const { flightInstructions, distance, droneOrientation } = this.props;
    const flightCoords = getDroneCoords(flightInstructions, distance);
    const currentPoint = this.getCurrentPoint(flightCoords);

    const latestInstructionMessage =
      flightInstructions[flightInstructions.length - 2].message;
    const leftDisabled = currentPoint.x === limits.maxX;
    const rightDisabled = currentPoint.x === limits.minX;
    const forwardDisabled = currentPoint.z === limits.maxZ;
    const reverseDisabled = currentPoint.z === limits.minZ;
    const upDisabled = currentPoint.y === limits.maxY;
    const downDisabled = currentPoint.y === limits.minY;
    return (
      <div id="build-screen">
        <Grid columns={3} padded>
          <Grid.Row>
            <Grid.Column width={3}>
              <Grid.Row>
                <Image
                  src={require('../assets/images/helper-images/build-instructions.png')}
                  size="large"
                />
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={9}>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="settings" />
                <Header.Content>
                  AutoPilot Builder
                  <Header.Subheader>
                    <i>Visualize your build path</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>

              <Grid.Row>
                <Grid.Column>
                  <BuildCanvas />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid columns={3} padded centered>
                  <Grid.Row>
                    <Grid.Column
                      as="h1"
                      textAlign="center"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#00a651',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      Up + Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={upDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        type="U"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>

                    <Grid.Column
                      as="h1"
                      textAlign="center"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#afafaf',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={false}
                        addFlightInstruction={this.addFlightInstruction}
                        type="C"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                    <Grid.Column
                      as="h1"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#00aeef',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                      textAlign="center"
                    >
                      Down + Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={downDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        type="D"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} padded>
                  <Grid.Column textAlign="center">
                    <Button onClick={() => this.addRotationInstruction('ccw')}>
                      <Button.Content visible>
                        <Icon name="undo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button onClick={() => this.addRotationInstruction('cw')}>
                      <Button.Content visible>
                        <Icon name="redo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} padded>
                  <Grid.Column textAlign="center">
                    <Button
                      disabled={flightInstructions.length <= 2}
                      onClick={() => this.deleteLastInstruction()}
                    >
                      Delete Last Instruction
                    </Button>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button
                      disabled={flightInstructions.length <= 2}
                      onClick={() => this.clearFlightInstructions()}
                    >
                      Clear All Instructions
                    </Button>
                  </Grid.Column>
                </Grid>
              </Grid.Row>

              <Grid.Row columns={3}>
                <Grid.Column textAlign="center">
                  <Link to={'/run'}>
                    <Button onClick={() => this.props.changeTab('run')}>
                      View On Run Screen!
                    </Button>
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  <Button
                    disabled={this.state.runButtonsDisabled}
                    onClick={this.preVisualizePath}
                  >
                    Pre-Visualize Path
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  {this.props.obstacles ? (
                    <Button onClick={this.props.toggleObstacles}>
                      Remove Obstacles
                    </Button>
                  ) : (
                    <Button onClick={this.props.toggleObstacles}>
                      Insert Obstacles
                    </Button>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={3}>
              <Segment inverted>
                <List divided inverted animated>
                  <List.Header>
                    <i>Flight Instructions</i>
                  </List.Header>
                  {flightInstructions
                    .map(instructionObj => instructionObj.message)
                    .map((message, ind) => {
                      let icon;
                      if (message === 'Takeoff') {
                        icon = 'hand point up';
                      } else if (message === 'Land') {
                        icon = 'hand point down';
                      } else if (message === 'Hold') {
                        icon = 'hourglass half';
                      } else {
                        icon = 'dot circle';
                      }
                      return (
                        <List.Item
                          className="flight-message-single"
                          key={ind}
                          content={message}
                          icon={icon}
                        />
                      );
                    })}
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    speed: state.speed,
    scale: state.scale,
    flightInstructions: state.flightInstructions,
    droneOrientation: state.droneOrientation,
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    droneConnectionStatus: state.droneConnectionStatus,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    clearInstructions: () => dispatch(clearInstructions()),
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
    toggleObstacles: () => {
      dispatch(toggleObstacles());
    },
    updateDroneConnectionStatus: droneStatus =>
      dispatch(updateDroneConnectionStatus(droneStatus)),
    rotateDrone: newOrientation => {
      dispatch(rotateDrone(newOrientation));
    },
    updateInstructions: updatedFlightInstructions =>
      dispatch(updateInstructions(updatedFlightInstructions)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Build);
