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
    const { distance } = this.props;
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
              <Button
                onClick={() => {
                  //100% for 1 second is about 90deg turn
                  this.realTimeFly(`rc 0 0 0 100`);
                  setTimeout(() => {
                    this.realTimeFly(`rc 0 0 0 0`);
                  }, 1000);
                }}
              >
                RC f
              </Button>
              <Button
                onClick={() => {
                  this.realTimeFly(`rc 0 20 0 0`);
                  setTimeout(() => {
                    this.realTimeFly(`rc 0 0 0 0`);
                  }, 1000);
                }}
              >
                Forward RC
              </Button>
              <Button
                onClick={() => {
                  this.realTimeFly(`rc 0 0 0 0`);
                }}
              >
                RC 0
              </Button>
              <Button
                onClick={() => {
                  this.realTimeFly(`rc 0 20 10 60`);
                }}
              >
                RC Forward Spin Up
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default FlyControls;
