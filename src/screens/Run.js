import React, { Component } from 'react';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
import { Button } from 'semantic-ui-react';
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

export default Run;
