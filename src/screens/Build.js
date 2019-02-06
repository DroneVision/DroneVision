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
import PreVisCanvas from '../components/PreVisCanvas';

import {
  changeTab,
  updateInstructions,
  clearInstructions,
  updateCDP,
  updateCDR,
  toggleObstacles,
  updateDroneConnectionStatus,
  rotateDrone,
  togglePreVisualizeAnimation,
} from '../store/store';

import { getFlightInstruction } from '../utils/buttonPanelUtils';

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
      preVisButtonsDisabled: false,
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
      flightInstructionObj.drawInstruction = `${direction} ${resultDegs}`;
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      flightInstructionObj.droneInstruction = `${direction} ${degs}`;
      flightInstructionObj.message = `${newMessage} --> ${degs} degrees`;
      flightInstructionObj.drawInstruction = `${direction} ${degs}`;
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
    const { flightInstructions, droneOrientation } = this.props;
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

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //Iterate over all flightInstructions
    for (let i = 0; i < flightInstructions.length; i++) {
      let animateInstruction = flightInstructions[i].drawInstruction;
      if (animateInstruction === 'takeoff') {
        this.props.updateCDP({
          x: this.props.startingPosition.x,
          y: this.props.startingPosition.y + 1,
          z: this.props.startingPosition.z,
        });
        await wait(commandDelays.takeoff);
        console.log('takeoff', animateInstruction);
      } else if (animateInstruction === 'land') {
        this.props.updateCDP({
          x: this.props.currentDronePosition.x,
          y: 0 + this.props.voxelSize * -0.5,
          z: this.props.currentDronePosition.z,
        });
        console.log('land', animateInstruction);
        setTimeout(() => {
          //After flight completes wait 10 seconds
          //Send drone model back to starting position
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });
          this.setState({
            preVisButtonsDisabled: false,
          });
          this.props.togglePreVisualizeAnimation();
          this.props.updateCDR(0);
        }, 3000);
      } else if (Array.isArray(animateInstruction)) {
        //create new object for new coordinates
        let newCoords = {};
        const [z, x, y] = animateInstruction;
        // x -> z
        // y -> x
        // z -> y
        newCoords.x = this.props.currentDronePosition.x + x;
        newCoords.y = this.props.currentDronePosition.y + y;
        newCoords.z = this.props.currentDronePosition.z + z;

        this.props.updateCDP(newCoords);
        console.log('other', animateInstruction);

        //Wait for Command Delay
        await wait(commandDelays.go);
      } else {
        //Handle Rotation
        const [rotationDirection, rotationDegrees] = animateInstruction.split(
          ' '
        );

        const rotationDegreesNumber = Number(rotationDegrees);
        const rotationAngles = {
          90: Math.PI / 2,
          180: Math.PI,
          270: Math.PI + Math.PI / 2,
        };

        if (rotationDirection === 'cw') {
          const newCWRotation =
            this.props.currentDroneRotation -
            rotationAngles[rotationDegreesNumber];
          await this.props.updateCDR(newCWRotation);
          console.log('its working');
        } else {
          const newCCWRotation =
            this.props.currentDroneRotation + Number(rotationDegrees);
          await this.props.updateCDR(newCCWRotation);
        }

        // console.log('rotation', animateInstruction);
        // console.log('rotationDirection', rotationDirection);
        // console.log('rotationDegree', rotationDegrees);
        // console.log('state rotation', this.props.currentDroneRotation);
        await wait(commandDelays.cw);
        // console.log('state rotation', this.props.currentDroneRotation);
      }
    }
  };

  preVisualizePath = async () => {
    // Disable Buttons
    this.setState({ preVisButtonsDisabled: true });
    await this.props.togglePreVisualizeAnimation();
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  handleButtonClick = (dirString, droneOrientation = 0) => {
    this.addFlightInstruction(
      getFlightInstruction(dirString, droneOrientation)
    );
  };

  render() {
    const { limits } = this.state;
    const {
      flightInstructions,
      droneOrientation,
      buildDronePosition,
    } = this.props;

    const latestInstructionMessage =
      flightInstructions[flightInstructions.length - 2].message;
    const leftDisabled = buildDronePosition.x === limits.maxX;
    const rightDisabled = buildDronePosition.x === limits.minX;
    const forwardDisabled = buildDronePosition.z === limits.maxZ;
    const reverseDisabled = buildDronePosition.z === limits.minZ;
    const upDisabled = buildDronePosition.y === limits.maxY;
    const downDisabled = buildDronePosition.y === limits.minY;
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
                  {this.props.preVisualizeAnimation ? (
                    <PreVisCanvas />
                  ) : (
                    <BuildCanvas />
                  )}
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid padded>
                  <Grid.Row columns={3} id="centered-padded-top">
                    <Grid.Column>
                      <h1>Up + Strafe</h1>
                    </Grid.Column>
                    <Grid.Column>
                      <h1>Strafe</h1>
                    </Grid.Column>
                    <Grid.Column>
                      <h1>Down + Strafe</h1>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row columns={3} padded>
                    <Grid.Column
                      id="centered-panel"
                      className="rounded"
                      style={{
                        backgroundColor: '#00a651',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                        borderRadius: '500',
                      }}
                    >
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={
                          upDisabled || this.state.preVisButtonsDisabled
                        }
                        clickHandler={this.handleButtonClick}
                        type="U"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>

                    <Grid.Column
                      className="rounded"
                      id="centered-panel"
                      style={{
                        backgroundColor: '#afafaf',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      <ButtonPanel
                        disabled={this.state.preVisButtonsDisabled}
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={this.state.preVisButtonsDisabled}
                        clickHandler={this.handleButtonClick}
                        type="C"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                    <Grid.Column
                      id="centered-panel"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#00aeef',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={
                          downDisabled || this.state.preVisButtonsDisabled
                        }
                        clickHandler={this.handleButtonClick}
                        type="D"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
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

          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={() => this.addRotationInstruction('ccw')}
              >
                <Button.Content visible>
                  <Icon name="undo" />
                  90&deg;
                </Button.Content>
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={() => this.addRotationInstruction('cw')}
              >
                <Button.Content visible>
                  <Icon name="redo" />
                  90&deg;
                </Button.Content>
              </Button>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                disabled={
                  this.state.preVisButtonsDisabled ||
                  flightInstructions.length <= 2
                }
                onClick={() => this.deleteLastInstruction()}
              >
                Delete Last Instruction
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                disabled={
                  this.state.preVisButtonsDisabled ||
                  flightInstructions.length <= 2
                }
                onClick={() => this.clearFlightInstructions()}
              >
                Clear All Instructions
              </Button>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column>
              <Link to={'/autopilot'}>
                <Button
                  disabled={this.state.preVisButtonsDisabled}
                  onClick={() => this.props.changeTab('autopilot')}
                >
                  View On Run Screen!
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={this.preVisualizePath}
              >
                Pre-Visualize Path
              </Button>
            </Grid.Column>
            <Grid.Column>
              {this.props.obstacles ? (
                <Button
                  disabled={this.state.preVisButtonsDisabled}
                  onClick={this.props.toggleObstacles}
                >
                  Remove Obstacles
                </Button>
              ) : (
                <Button
                  disabled={this.state.preVisButtonsDisabled}
                  onClick={this.props.toggleObstacles}
                >
                  Insert Obstacles
                </Button>
              )}
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
    currentDroneRotation: state.currentDroneRotation,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    droneConnectionStatus: state.droneConnectionStatus,
    buildDronePosition: state.buildDronePosition,
    preVisualizeAnimation: state.preVisualizeAnimation,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    clearInstructions: () => dispatch(clearInstructions()),
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
    updateCDR: newRotation => {
      dispatch(updateCDR(newRotation));
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
    togglePreVisualizeAnimation: () => dispatch(togglePreVisualizeAnimation()),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Build);
