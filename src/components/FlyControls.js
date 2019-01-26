import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
const { ipcRenderer } = window.require('electron');

class FlyControls extends Component {
  realTimeFly = instruction => {
    console.log('sending single instruction to drone', instruction);
    ipcRenderer.send('single-instruction', instruction);
  };

  realTimeTakeOff = () => {
    console.log('sending single instruction to drone', 'takeoff');
    ipcRenderer.send('takeoff');
  };
  render() {
    const { distance, speed } = this.props;
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <p>FLY IN REAL TIME</p>
              <Button onClick={() => this.realTimeTakeOff()}>Take Off</Button>
              <br />
              <br />
              <Button onClick={() => this.realTimeFly(`up ${distance}`)}>
                Up
              </Button>
              <Button onClick={() => this.realTimeFly(`forward ${distance}`)}>
                Forward
              </Button>
              <br />
              <Button onClick={() => this.realTimeFly(`right ${distance}`)}>
                Right
              </Button>
              <Button onClick={() => this.realTimeFly(`left ${distance}`)}>
                Left
              </Button>
              <br />
              <Button onClick={() => this.realTimeFly(`down ${distance}`)}>
                Down
              </Button>
              <Button onClick={() => this.realTimeFly(`back ${distance}`)}>
                Back
              </Button>
              <br />
              <br />
              <Button onClick={() => this.realTimeFly(`flip f`)}>
                Front-Flip
              </Button>
              <Button onClick={() => this.realTimeFly(`flip b`)}>
                Back-Flip
              </Button>
              <Button onClick={() => this.realTimeFly(`flip l`)}>
                Left-Flip
              </Button>
              <Button onClick={() => this.realTimeFly(`flip r`)}>
                Right-Flip
              </Button>
              <br />
              <br />
              <Button onClick={() => this.realTimeFly(`land`)}>Land</Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={() => this.realTimeFly(`emergency`)}>
                EMERGENCY STOP
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default FlyControls;
