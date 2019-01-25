import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
// import { Button, Icon } from 'semantic-ui-react';
import UpPlane from '../components/UpPlane';
import CurrentPlane from '../components/CurrentPlane';
import DownPlane from '../components/DownPlane';
import Canvas from '../components/Canvas';
import FlyControls from '../components/FlyControls';

// import {
//   increaseDistance,
//   decreaseDistance,
//   increaseSpeed,
//   decreaseSpeed,
// } from '../store/reducer';
// import StatusContainer from '../components/StatusContainer';

class Build extends Component {
  constructor() {
    super();
    this.state = {
      flightCommands: ['command', 'takeoff', 'land'],
    };
  }

  addDirection = newDirection => {
    console.log(this.state.flightCommands);
    let tmpArray = this.state.flightCommands.slice();
    tmpArray.splice(-1, 0, newDirection);
    console.log(tmpArray);
    this.setState({
      flightCommands: tmpArray,
    });
  };

  deleteLast = () => {
    if (this.state.flightCommands.length > 3) {
      console.log(this.state.flightCommands);
      let tmpArray = this.state.flightCommands.slice();
      tmpArray.splice(-2, 1);
      console.log(tmpArray);
      this.setState({
        flightCommands: tmpArray,
      });
    }
  };

  clear = () => {
    this.setState({ flightCommands: ['command', 'takeoff', 'land'] });
  };

  runAutoPilot = () => {
    console.log('sending auto pilot to drone', this.state.flightCommands);
    socket.emit('autopilot', this.state.flightCommands);
  };

  render() {
    return (
      <div id="test">
        <h1>AutoPilot Builder/Visualizer</h1>
        <Canvas />
        <p>{`${this.state.flightCommands
          .toString()
          .split(',')
          .join(' --> ')}`}</p>
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
                  <UpPlane
                    addDirection={this.addDirection}
                    distance={this.props.distance}
                    speed={this.props.speed}
                  />
                </td>
                <td>
                  <CurrentPlane
                    addDirection={this.addDirection}
                    distance={this.props.distance}
                    speed={this.props.speed}
                  />
                </td>
                <td>
                  <DownPlane
                    addDirection={this.addDirection}
                    distance={this.props.distance}
                    speed={this.props.speed}
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
                  <button onClick={() => this.deleteLast()}>Delete</button>
                  <button onClick={() => this.clear()}>Clear</button>
                  <br /> <br />
                  <button onClick={() => this.runAutoPilot()}>
                    Send AutoPilot to Drone
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />
        <div id="controls-real-time">
          <FlyControls
            distance={this.props.distance}
            speed={this.props.speed}
          />
        </div>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    speed: state.speed,
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
