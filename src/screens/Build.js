import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, List } from 'semantic-ui-react';
import Plane from '../components/Plane';
import Canvas from '../components/Canvas';
import PubSub from 'pubsub-js';

const { ipcRenderer } = window.require('electron');

class Build extends Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.state = {
      flightCommands: [
        { command: 'takeoff', message: 'Takeoff' },
        { command: 'land', message: 'Land' },
      ],
      // flightMessages: ['Takeoff', 'Land'],
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

  drawPath = flightCommands => {
    const flightCoords = this.getFlightCoords(flightCommands);
    PubSub.publish('draw-path', flightCoords);
  };

  addDirection = (flightCommand, flightMessage) => {
    const { flightCommands } = this.state;

    let updatedFlightCommands = flightCommands.slice();

    const flightCommandObj = { command: flightCommand, message: flightMessage };

    updatedFlightCommands.splice(-1, 0, flightCommandObj);
    this.drawPath(updatedFlightCommands);
    this.setState({
      flightCommands: updatedFlightCommands,
    });
  };

  deleteLast = () => {
    // console.log(this.state.flightCommands);
    const { flightCommands } = this.state;
    let updatedFlightCommands = flightCommands.slice();
    updatedFlightCommands.splice(-2, 1);

    this.drawPath(updatedFlightCommands);
    this.setState({
      flightCommands: updatedFlightCommands,
    });
  };

  clear = () => {
    this.drawPath([]);
    this.setState({
      flightCommands: [
        { command: 'takeoff', message: 'Takeoff' },
        { command: 'land', message: 'Land' },
      ],
    });
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

  getFlightCoords = flightCommands => {
    const { distance } = this.props;

    return flightCommands.slice(1, -1).map(commandObj =>
      commandObj.command
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
    const { limits, flightCommands } = this.state;
    const flightCoords = this.getFlightCoords(flightCommands);
    const currentPoint = this.getCurrentPoint(flightCoords);

    const latestCommandMessage =
      flightCommands[flightCommands.length - 2].message;
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
              {flightCommands
                .map(commandObj => commandObj.message)
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
                      <Plane
                        latestCommandMessage={latestCommandMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={upDisabled}
                        addDirection={this.addDirection}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Up"
                      />
                    </td>
                    <td>
                      <Plane
                        latestCommandMessage={latestCommandMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={false}
                        addDirection={this.addDirection}
                        distance={this.props.distance}
                        speed={this.props.speed}
                        type="Current"
                      />
                    </td>
                    <td>
                      <Plane
                        latestCommandMessage={latestCommandMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={downDisabled}
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
