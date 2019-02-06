import React, { Component } from 'react';
import Stream from '../components/Stream';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import { Button } from 'semantic-ui-react';

const { ipcRenderer } = window.require('electron');

class StreamingScreen extends Component {
  constructor() {
    super();
  }

  startRecordingVideo = () => {
    ipcRenderer.send('single-instructions', 'command');
    ipcRenderer.send('single-instructions', 'streamon');
  };

  stopRecordingVideo = () => {
    ipcRenderer.send('single-instructions', 'streamoff');
  };

  render() {
    return (
      <div id="streaming-screen">
        <h1>Streaming</h1>

        <div>
          <Stream />
        </div>
        <div>
          <StatusContainer />
        </div>
        <div>
          <DroneTelemetry />
        </div>
        <div>
          <Button onClick={this.startRecordingVideo}>Start Stream</Button>
        </div>
        <div>
          <Button onClick={this.stopRecordingVideo}>Stop Stream</Button>
        </div>
      </div>
    );
  }
}

export default StreamingScreen;
