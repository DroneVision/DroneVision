import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
import PubSub from 'pubsub-js';
import wait from 'waait';
import { Button } from 'semantic-ui-react';
import { drawPath } from '../utils/drawPathUtils';
import { updateCDP } from '../store/store';
import commandDelays from '../drone/commandDelays';

const { ipcRenderer } = window.require('electron');
class Run extends Component {
  constructor() {
    super();

    this.state = {
      duration: 10,
    };
  }

  componentDidMount() {
    drawPath(this.props.flightInstructions, this.props.distance);
  }

  connectToDroneHandler = () => {
    ipcRenderer.send('connect-to-drone');
  };

  startRecordingVideo = () => {
    let durationToSend = this.state.duration;
    if (durationToSend < 10) {
      durationToSend = 10;
    }

    ipcRenderer.send('start-recording', parseInt(durationToSend));
  };

  stopRecordingVideo = () => {
    ipcRenderer.send('stop-recording');
  };

  moveSphere = () => {
    PubSub.publish('move-sphere');
  };

  handleDurationChange = event => {
    this.setState({ duration: event.target.value });
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
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });
        }, 10000);
      } else {
        this.props.updateCDP(newCoords);
      }
      //Wait for Command Delay
      await wait(commandDelays[instructionName]);
    }
  };

  runFlightInstructions = () => {
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    console.log('sending auto pilot to drone', droneInstructions);

    ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
    console.log('this.props.flightInstructions', this.props.flightInstructions);
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  render() {
    return (
      <div id="run">
        <h1>Run 3D Model</h1>
        <table>
          <tr>
            <td>
              <Canvas />
            </td>
            <td>
              <Stream />
            </td>
          </tr>
          <tr>
            <td>
              <DroneTelemetry />
            </td>
            <td>
              <StatusContainer />
            </td>
          </tr>
          <tr>
            <td>
              <Button onClick={() => this.startRecordingVideo()}>
                Start Recording
              </Button>
              <Button onClick={() => this.stopRecordingVideo()}>
                Reset Video Recorder
              </Button>
              <Button onClick={() => this.moveSphere()}>Move Sphere</Button>
              <Button onClick={this.runFlightInstructions}>Test Run</Button>
              <Button>Record Run</Button>
            </td>
            <td>
              Video Duration:{' '}
              <input
                type="number"
                value={this.state.duration}
                onChange={this.handleDurationChange}
              />
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    flightInstructions: state.flightInstructions,
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
  };
};

const mapDispatch = dispatch => {
  return {
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(Run);
