import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';

const FlyControls = props => {
  return (
    <table>
      <tr>
        <td>
          <p>FLY IN REAL TIME</p>
          <Button onClick={() => props.realTimeTakeOff()}>Take Off</Button>
          <br />
          <br />
          <Button onClick={() => props.realTimeFly(`up ${props.distance}`)}>
            Up
          </Button>
          <Button
            onClick={() => props.realTimeFly(`forward ${props.distance}`)}
          >
            Forward
          </Button>
          <br />
          <Button onClick={() => props.realTimeFly(`right ${props.distance}`)}>
            Right
          </Button>
          <Button onClick={() => props.realTimeFly(`left ${props.distance}`)}>
            Left
          </Button>
          <br />
          <Button onClick={() => props.realTimeFly(`down ${props.distance}`)}>
            Down
          </Button>
          <Button onClick={() => props.realTimeFly(`back ${props.distance}`)}>
            Back
          </Button>
          <br />
          <br />
          <Button onClick={() => props.realTimeFly(`flip f`)}>
            Front-Flip
          </Button>
          <Button onClick={() => props.realTimeFly(`flip b`)}>Back-Flip</Button>
          <Button onClick={() => props.realTimeFly(`flip l`)}>Left-Flip</Button>
          <Button onClick={() => props.realTimeFly(`flip r`)}>
            Right-Flip
          </Button>
          <br />
          <br />
          <Button onClick={() => props.realTimeFly(`land`)}>Land</Button>
          &nbsp;&nbsp;&nbsp;
          <Button onClick={() => props.realTimeFly(`emergency`)}>
            EMERGENCY STOP
          </Button>
        </td>
      </tr>
    </table>
  );
};

export default FlyControls;
