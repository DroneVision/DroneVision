import React, { Component } from 'react';
import StatusContainer from '../components/StatusContainer';
import DroneModel from '../components/DroneModel';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
const { ipcRenderer } = window.require('electron');

class Run extends Component {
  constructor(props) {
    super(props);
  }

  connectToDroneHandler = () => {
    ipcRenderer.send('connect-to-drone');
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
              <DroneModel />
            </td>
            <td>
              <StatusContainer />
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Run;
