import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
import { Button } from 'semantic-ui-react';
import { drawPath } from '../utils/drawPathUtils';

const { ipcRenderer } = window.require('electron');
class Run extends Component {
  constructor() {
    super();

    this.state = {
      duration: 10,
    };
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

  handleDurationChange = event => {
    this.setState({ duration: event.target.value });
  };

  componentDidMount() {
    drawPath(this.props.flightInstructions, this.props.distance);
  }

  runFlightInstructions = () => {
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    console.log('sending auto pilot to drone', droneInstructions);

    ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
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
  };
};

export default connect(
  mapState,
  null
)(Run);
