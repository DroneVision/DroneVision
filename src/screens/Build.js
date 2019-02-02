import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
    const { gridWidth, gridLength, gridHeight, distance } = this.props;
    this.state = {
      startingPoint: { x: 0, y: 1, z: 0 },
    };
  }

  componentDidMount() {
    drawPath(this.props.flightInstructions, this.props.distance);
    // Listen for flight import from main process
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
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
  }

  addFlightInstruction = ({ flightInstruction, flightMessage }) => {
    const { flightInstructions, speed, distance } = this.props;

    const latestInstructionObj =
      flightInstructions[flightInstructions.length - 2];

    const latestMessage = latestInstructionObj.message
      .split(' ')
      .slice(0, -3)
      .join(' ');

    const latestInstructionArr = latestInstructionObj.instruction.split(' ');
    const latestSpeed = latestInstructionArr[latestInstructionArr.length - 1];

    const flightInstructionObj = {};

    let updatedFlightInstructions = flightInstructions.slice();
    if (flightMessage === latestMessage && speed === latestSpeed) {
      // Redundant instruction, so just adjust the last one's values
      if (flightInstruction === 'hold') {
        // TODO: add logic for hold
      } else if (flightInstruction === 'rotate') {
        console.log('hi');
      } else {
        const {
          instruction: latestInstruction,
          message: latestMessage,
        } = latestInstructionObj;
        const latestinstructionCoords = latestInstruction
          .split(' ')
          .slice(1, 4);

        const resultCoords = latestinstructionCoords.map((coord, idx) => {
          return Number(coord) + Number(flightInstruction[idx]);
        });

        const newInstruction = `go ${resultCoords.join(' ')} ${speed}`;

        flightInstructionObj.instruction = newInstruction;

        const latestDistance = Number(
          latestMessage.split(' ').slice(-2, -1)[0]
        );
        const newDistance = Number(flightMessage.split(' ').slice(-2, -1)[0]);
        const resultDistance = latestDistance + newDistance;

        const newMessage = `${flightMessage} --> ${resultDistance.toFixed(
          1
        )} m`;

        flightInstructionObj.message = newMessage;
      }
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      //New flight instruction (non-duplicate), so add it in
      flightInstructionObj.instruction = `go ${flightInstruction.join(
        ' '
      )} ${speed}`;
      flightInstructionObj.message = `${flightMessage} --> ${distance} m`;
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
      { ...this.props.startingPosition }
    );
    return currentPoint;
  };

  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFlightInstructions();
    this.props.updateInstructions(flightInstructions);
    drawPath(this.props.flightInstructions, this.props.distance);
  };

  render() {
    const {
      gridWidth,
      gridLength,
      gridHeight,
      flightInstructions,
      distance,
      droneOrientation,
    } = this.props;
    const flightCoords = getFlightCoords(flightInstructions, distance);
    const currentPoint = this.getCurrentPoint(flightCoords);

    const latestInstructionMessage =
      flightInstructions[flightInstructions.length - 2].message;
    const leftDisabled = currentPoint.x === gridWidth / 2;
    const rightDisabled = currentPoint.x === -gridWidth / 2;
    const forwardDisabled = currentPoint.z === gridLength / 2;
    const reverseDisabled = currentPoint.z === -gridLength / 2;
    const upDisabled = currentPoint.y === gridHeight;
    const downDisabled = currentPoint.y === 1 * (distance / 100);
    return (
      <div id="build-screen">
        <Grid columns={2} divided padded centered>
          <Grid.Row stretched>
            <Grid.Column width={8}>
              <Header as="h1" dividing id="ap-header">
                <Icon name="settings" />
                <Header.Content>
                  AutoPilot Builder
                  <Header.Subheader>
                    <i>Visualize your build path</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>

              <Grid.Row centered>
                <Grid.Column textAlign="center" centered>
                  <Canvas />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid columns={3} padded>
                  <Grid.Row centered>
                    <Grid.Row centered>
                      <Grid.Column as="h1" textAlign="center">
                        Up Plane
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
                    </Grid.Row>
                    <Grid.Row centered>
                      <Grid.Column as="h1" textAlign="center">
                        Current Plane
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
                    </Grid.Row>
                    <Grid.Row centered>
                      <Grid.Column as="h1" textAlign="center">
                        Down Plane
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
                <Grid columns={3} padded centered>
                  <Grid.Column textAlign="center">
                    <Link to={'/run'}>
                      <Button onClick={() => this.props.changeTab('run')}>
                        View On Run Screen!
                      </Button>
                    </Link>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button
                      onClick={() =>
                        saveFlightInstructions(this.props.flightInstructions)
                      }
                    >
                      Save Flight Path
                    </Button>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button onClick={this.handleLoadFlightInstructions}>
                      Load Flight Path
                    </Button>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={4}>
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
    gridWidth: state.gridWidth,
    gridLength: state.gridLength,
    gridHeight: state.gridHeight,
    droneOrientation: state.droneOrientation,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
      dispatch(updateInstructions(flightInstructions)),
    clearInstructions: () => dispatch(clearInstructions()),
  };
};

// const mapDispatch = dispatch => {
//   return {
//     increaseDistance: () => {
//       dispatch(increaseDistance());
//     },
//     decreaseDistance: () => {
//       dispatch(decreaseDistance());
//     },
//     increaseSpeed: () => {
//       dispatch(increaseSpeed());
//     },
//     decreaseSpeed: () => {
//       dispatch(decreaseSpeed());
//     },
//   };
// };

export default connect(
  mapState,
  mapDispatch
)(Build);
