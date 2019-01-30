import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon, List } from 'semantic-ui-react';
import ButtonPanel from '../components/ButtonPanel';
import Canvas from '../components/Canvas';
import {
  changeTab,
  updateInstructions,
  clearInstructions,
} from '../store/store';

import PubSub from 'pubsub-js';

const { ipcRenderer } = window.require('electron');

class Build extends Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.state = {
      // flightCommands: [
      //   { command: 'takeoff', message: 'Takeoff' },
      //   { command: 'land', message: 'Land' },
      // ],
      limits: {
        maxX: scale / 2,
        maxY: scale,
        maxZ: scale / 2,
        minX: -scale / 2,
        minY: 1,
        minZ: -scale / 2,
      },
      startingPoint: { x: 0, y: 1, z: 0 },
    };
  }

  componentDidMount() {
    this.drawPath(this.props.flightInstructions);
  }

  drawPath = flightInstructions => {
    const flightCoords = this.getFlightCoords(flightInstructions);
    PubSub.publish('draw-path', flightCoords);
  };

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
    console.log(updatedFlightInstructions);
    this.drawPath(updatedFlightInstructions);
    // this.setState({
    //   flightInstructions: updatedFlightInstructions,
    // });
    this.props.updateInstructions(updatedFlightInstructions);
  };

  deleteLastInstruction = () => {
    const { flightInstructions } = this.props;
    let updatedFlightInstructions = flightInstructions.slice();
    updatedFlightInstructions.splice(-2, 1);

    this.drawPath(updatedFlightInstructions);
    // this.setState({
    //   flightInstructions: updatedFlightInstructions,
    // });
    this.props.updateInstructions(updatedFlightInstructions);
  };

  clearFlightInstructions = () => {
    this.drawPath([]);
    this.props.clearInstructions();
    // this.setState({
    //   flightCommands: [
    //     { command: 'takeoff', message: 'Takeoff' },
    //     { command: 'land', message: 'Land' },
    //   ],
    // });
  };

  addLine = (point1, point2) => {
    PubSub.publish('new-line', { point1, point2 });
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

  getFlightCoords = flightInstructions => {
    const { distance } = this.props;

    return flightInstructions.slice(1, -1).map(instructionObj =>
      instructionObj.instruction
        .split(' ')
        .slice(1, 4)
        .map(numStr => Number(numStr) / distance)
    );
  };

  runAutoPilot = () => {
    console.log('sending auto pilot to drone', this.state.flightCommands);
    ipcRenderer.send('autopilot', ['command', ...this.state.flightCommands]);
  };

  render() {
    const { limits } = this.state;
    const { flightInstructions } = this.props;
    const flightCoords = this.getFlightCoords(flightInstructions);
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
        <h1>AutoPilot Builder/Visualizer</h1>
        <div id="build-content">
          <div id="flight-messages">
            <List divided>
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
          </div>
          <div id="builder">
            <Canvas />
            {/* <p>{`${flightMessages.join(' --> ')}`}</p> */}

            <br />
            <p>CREATE AUTOPILOT</p>

            <div id="controls-3d">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h1>Up</h1>
                    </td>
                    <td>
                      <h1>Horizontal</h1>
                    </td>
                    <td>
                      <h1>Down</h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
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
                    </td>
                    <td>
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
                    </td>
                    <td>
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="delete-clear-send">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Button
                        disabled={flightInstructions.length <= 2}
                        onClick={() => this.deleteLastInstruction()}
                      >
                        Delete Last Instruction
                      </Button>
                      <Button
                        disabled={flightInstructions.length <= 2}
                        onClick={() => this.clearFlightInstructions()}
                      >
                        Clear All Instructions
                      </Button>
                      <br /> <br />
                      <Link to={'/run'}>
                        <Button onClick={() => this.props.changeTab('run')}>
                          View On Run Screen!
                        </Button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
      dispatch(updateInstructions(flightInstructions)),
    clearInstructions: () => dispatch(clearInstructions),
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
