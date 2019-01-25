import React, { Component } from 'react';
import StatusContainer from '../components/StatusContainer';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
import { ipcRenderer } from 'electron';

class Run extends Component {
  constructor(props) {
    super(props);
  }

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
