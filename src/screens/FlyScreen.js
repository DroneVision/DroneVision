import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import FlyControls from '../components/FlyControls';
import Stream from '../components/Stream';
import StatusContainer from '../components/StatusContainer';
import { ipcRenderer } from 'electron';

class FlyScreen extends Component {
  constructor() {
    super();
  }

  realTimeFly = instruction => {
    console.log('sending single instruction to drone', instruction);
    ipcRenderer.sendSync('single-instruction', instruction);
  };

  realTimeTakeOff = () => {
    console.log('sending single instruction to drone', 'takeoff');
    ipcRenderer.sendSync('takeoff');
  };

  render() {
    return (
      <div id="fly">
        <h1>Fly in Real Time</h1>
        <Stream />
        <StatusContainer />
        <FlyControls distance={this.props.distance} speed={this.props.speed} />
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
//       dispatch(incsldknreaseDistance());
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
)(FlyScreen);
