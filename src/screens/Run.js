import React, { Component } from 'react';
import StatusContainer from '../components/StatusContainer';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
const { ipcRenderer } = window.require('electron');

class Run extends Component {
  connectToDroneHandler = () => {
    ipcRenderer.send('connect-to-drone');
  };
  render() {
    return (
      <div>
        <table>
          <tr>
            <td>
              <Canvas />
            </td>
            <td>
              <Stream />
            </td>
          </tr>
        </table>
        <StatusContainer />
      </div>
    );
  }
}

export default Run;
