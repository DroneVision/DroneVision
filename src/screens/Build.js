import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
import { Button, Icon, List } from 'semantic-ui-react';
// import UpPlane from '../components/UpPlane';
import Plane from '../components/Plane';
// import DownPlane from '../components/DownPlane';
import Canvas from '../components/Canvas';
import FlyControls from '../components/FlyControls';

import PubSub from 'pubsub-js';

const { ipcRenderer } = window.require('electron');

// import {
//   increaseDistance,
//   decreaseDistance,
//   increaseSpeed,
//   decreaseSpeed,
// } from '../store/reducer';
// import StatusContainer from '../components/StatusContainer';

class Build extends Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.state = {
      flightCommands: ['takeoff', 'land'],
      flightMessages: ['Takeoff', 'Land'],
      limits: {
        maxX: scale / 2,
        maxY: scale / 2,
        maxZ: scale,
        minX: -scale / 2,
        minY: -scale / 2,
        minZ: 1,
      },
      currentPoint: { x: 0, y: 1, z: 0 },
    };
  }

  addDirection = (flightCommand, flightMessage) => {
    const { flightCommands, flightMessages, currentPoint } = this.state;
    const { distance } = this.props;
    // console.log(flightCommands);
    let updatedFlightCommands = flightCommands.slice();
    updatedFlightCommands.splice(-1, 0, flightCommand);

    let updatedFlightMessages = flightMessages.slice();
    updatedFlightMessages.splice(-1, 0, flightMessage);

    if (flightCommand !== 'hold') {
      // console.log(tmpArray);
      let [x, y, z] = flightCommand
        .split(' ')
        .slice(1, 4)
        .map(numStr => Number(numStr) / distance);

      let tempx = x;
      let tempy = y;

      x = -tempy;
      y = tempx;

      let newtempx = x;
      let newtempy = y;
      let newtempz = z;

      z = newtempy;
      x = -newtempx;
      y = newtempz;

      console.log(x, y, z);
      const { x: x0, y: y0, z: z0 } = currentPoint;
      const newPoint = { x: x0 + x, y: y0 + y, z: z0 + z };
      this.addLine(currentPoint, newPoint);
      this.setState({ currentPoint: newPoint });
    } else {
      //To-do: add logic for when a hold command is sent
      //create a new pub-sub channel that adds some marker to the canvas where the hold is occuring
    }
    this.setState({
      flightCommands: updatedFlightCommands,
      flightMessages: updatedFlightMessages,
    });
  };

  deleteLast = () => {
    // console.log(this.state.flightCommands);
    const { flightCommands, flightMessages } = this.state;
    let updatedFlightCommands = flightCommands.slice();
    updatedFlightCommands.splice(-2, 1);

    let updatedFlightMessages = flightMessages.slice();
    updatedFlightMessages.splice(-2, 1);
    // console.log(updatedFlightCommands);
    this.setState({
      flightCommands: updatedFlightCommands,
      flightMessages: updatedFlightMessages,
    });
  };

  clear = () => {
    this.setState({
      flightCommands: ['takeoff', 'land'],
      flightMessages: ['Takeoff', 'Land'],
    });
  };

  runAutoPilot = () => {
    console.log('sending auto pilot to drone', this.state.flightCommands);
    ipcRenderer.send('autopilot', ['command', ...this.state.flightCommands]);
  };

  addLine = (point1, point2) => {
    PubSub.publish('new-line', { point1, point2 });
  };

  render() {
    const { currentPoint, limits, flightCommands, flightMessages } = this.state;
    return (
      <div id="build-screen">
        <h1>AutoPilot Builder/Visualizer</h1>
        <div id="build-content">
          <div id="flight-messages">
            <List divided>
              {flightMessages.map((message, ind) => {
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
                    className="flight-message"
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
                      <Plane
                        leftDisabled={currentPoint.y === limits.minY}
                        rightDisabled={currentPoint.y === limits.maxY}
                        forwardDisabled={currentPoint.x === limits.maxX}
                        reverseDisabled={currentPoint.x === limits.minY}
                        allDisabled={currentPoint.z === limits.maxZ}
                        addDirection={this.addDirection}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Up"
                      />
                    </td>
                    <td>
                      <Plane
                        leftDisabled={currentPoint.y === limits.minY}
                        rightDisabled={currentPoint.y === limits.maxY}
                        forwardDisabled={currentPoint.x === limits.maxX}
                        reverseDisabled={currentPoint.x === limits.minY}
                        allDisabled={false}
                        addDirection={this.addDirection}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Current"
                      />
                    </td>
                    <td>
                      <Plane
                        leftDisabled={currentPoint.y === limits.minY}
                        rightDisabled={currentPoint.y === limits.maxY}
                        forwardDisabled={currentPoint.x === limits.maxX}
                        reverseDisabled={currentPoint.x === limits.minY}
                        allDisabled={currentPoint.z === limits.minZ}
                        currentPoint={currentPoint}
                        addDirection={this.addDirection}
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
                        disabled={flightCommands.length <= 2}
                        onClick={() => this.deleteLast()}
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={flightCommands.length <= 2}
                        onClick={() => this.clear()}
                      >
                        Clear
                      </Button>
                      <br /> <br />
                      <Button onClick={() => this.runAutoPilot()}>
                        Send AutoPilot to Drone
                      </Button>
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
  null
)(Build);
