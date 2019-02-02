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
  Responsive,
} from 'semantic-ui-react';

import ButtonPanel from '../components/ButtonPanel';
import Canvas from '../components/Canvas';
import {
  changeTab,
  updateInstructions,
  clearInstructions,
  updateCDP,
  toggleObstacles,
  updateDroneConnectionStatus
} from '../store/store';

import { drawPath, getFlightCoords } from '../utils/drawPathUtils';
import {
  saveFlightInstructions,
  loadFlightInstructions,
} from '../utils/fileSystemUtils';

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
    drawPath(this.props.flightInstructions, this.props.distance);
    // Listen for flight import from main process
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
      drawPath(flightInstructions, this.props.distance);
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
    });
  }

  addFlightInstruction = (flightInstruction, flightMessage) => {
    const { flightInstructions } = this.props;

    const latestInstructionObj =
      flightInstructions[flightInstructions.length - 2];

    const latestInstructionName = latestInstructionObj.message
      .split(' ')
      .slice(0, -3)
      .join(' ');
    const newInstructionName = flightMessage
      .split(' ')
      .slice(0, -3)
      .join(' ');
    const flightInstructionObj = {
      instruction: flightInstruction,
      message: flightMessage,
    };

    let updatedFlightInstructions = flightInstructions.slice();
    if (newInstructionName === latestInstructionName) {
      // Redundant instruction, so just adjust the last one's values
      if (flightInstruction === 'hold') {
        // TODO: add logic for hold
      } else {
        const {
          instruction: latestInstruction,
          message: latestMessage,
        } = latestInstructionObj;
        const latestinstructionCoords = latestInstruction
          .split(' ')
          .slice(1, 4);
        const newinstructionCoords = flightInstruction.split(' ').slice(1, 4);
        const resultCoords = latestinstructionCoords.map((coord, idx) => {
          return Number(coord) + Number(newinstructionCoords[idx]);
        });
        const [
          instructionWord,
          ,
          ,
          ,
          instructionSpeed,
        ] = latestInstruction.split(' ');

        const newinstruction = `${instructionWord} ${resultCoords.join(
          ' '
        )} ${instructionSpeed}`;

        flightInstructionObj.instruction = newinstruction;

        const latestDistance = Number(
          latestMessage.split(' ').slice(-2, -1)[0]
        );
        const newDistance = Number(flightMessage.split(' ').slice(-2, -1)[0]);
        const resultDistance = latestDistance + newDistance;

        const newMessage = `${newInstructionName} --> ${resultDistance.toFixed(
          1
        )} m`;

        flightInstructionObj.message = newMessage;
      }
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      //New flight instruction (non-duplicate), so add it in
      updatedFlightInstructions.splice(-1, 0, flightInstructionObj);
    }

    drawPath(updatedFlightInstructions, this.props.distance);

    this.props.updateInstructions(updatedFlightInstructions);
  };

  deleteLastInstruction = () => {
    const { flightInstructions, distance } = this.props;
    let updatedFlightInstructions = flightInstructions.slice();
    updatedFlightInstructions.splice(-2, 1);

    drawPath(updatedFlightInstructions, distance);
    this.props.updateInstructions(updatedFlightInstructions);
  };

  clearFlightInstructions = () => {
    drawPath([], this.props.distance);
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
      { ...this.state.startingPoint }
    );
    return currentPoint;
  };

  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFlightInstructions();
    this.props.updateInstructions(flightInstructions);
    drawPath(this.props.flightInstructions, this.props.distance);
  };

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //Iterate over all flightInstructions
    for (let i = 0; i < flightInstructions.length; i++) {
      let flightInstruction = flightInstructions[i];
      let instructionName = flightInstruction.instruction.split(' ')[0];
      //create new object for new coordinates
      let newCoords = {};
      let flightInstructionArray = flightInstruction.instruction
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
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    // //Fly drone
    // ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
    //Animate 3D drone model on Canvas
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  render() {
    const { limits } = this.state;
    const { flightInstructions, distance } = this.props;
    const flightCoords = getFlightCoords(flightInstructions, distance);
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
        <Grid columns={3} divided padded>
          <Grid.Row>
            <Grid.Column width={3}>
              <Button onClick={this.handleLoadFlightInstructions}>
                Import Flight Path
              </Button>
              <Button
                onClick={() =>
                  saveFlightInstructions(this.props.flightInstructions)
                }
              >
                Export Flight Path
              </Button>
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
                  <Canvas />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid columns={3} padded centered>
                  <Grid.Row>
                    <Grid.Column as="h1" textAlign="center">
                      Up
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={upDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Up"
                      />
                    </Grid.Column>

                    <Grid.Column as="h1" textAlign="center">
                      Horizontal
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={false}
                        addFlightInstruction={this.addFlightInstruction}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Current"
                      />
                    </Grid.Column>
                    <Grid.Column as="h1" textAlign="center">
                      Down
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={downDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Down"
                      />
                    </Grid.Column>
                  </Grid.Row>
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

              <Grid.Row>
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
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    droneConnectionStatus: state.droneConnectionStatus
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
    dispatch(updateInstructions(flightInstructions)),
    clearInstructions: () => dispatch(clearInstructions()),
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
    toggleObstacles: () => {
      dispatch(toggleObstacles());
    },
    updateDroneConnectionStatus: droneStatus => dispatch(updateDroneConnectionStatus(droneStatus))
  };
};

export default connect(
  mapState,
  mapDispatch
)(Build);
