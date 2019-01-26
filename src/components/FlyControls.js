import React from 'react';
import { Button } from 'semantic-ui-react';

const FlyControls = props => {
  return (
    <div id="fly-controls">
      <table>
        <tbody>
          <tr>
            <td>
              <Button onClick={() => this.realTimeTakeOff()}>Take Off</Button>
              <br />
              <br />
              <Button
                onClick={() => this.realTimeFly(`up ${this.props.distance}`)}
              >
                Up
              </Button>
              <Button
                onClick={() =>
                  this.realTimeFly(`forward ${this.props.distance}`)
                }
              >
                Forward
              </Button>
              <br />
              <Button
                onClick={() => this.realTimeFly(`right ${this.props.distance}`)}
              >
                Right
              </Button>
              <Button
                onClick={() => this.realTimeFly(`left ${this.props.distance}`)}
              >
                Left
              </Button>
              <br />
              <Button
                onClick={() => this.realTimeFly(`down ${this.props.distance}`)}
              >
                Down
              </Button>
              <Button
                onClick={() => this.realTimeFly(`back ${this.props.distance}`)}
              >
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
    </div>
  );
};

export default FlyControls;
