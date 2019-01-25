import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';

const CurrentPlane = props => {
  return (
    <table>
      <tr>
        <td />
        <td />
      </tr>
      <tr>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="f-left" name="arrow up" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="forward" name="arrow up" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="f-right" name="arrow up" />
            </Button.Content>
          </Button>
        </td>
      </tr>
      <tr>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="left" name="arrow left" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="hold" name="hourglass half" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="right" name="arrow right" />
            </Button.Content>
          </Button>
        </td>
      </tr>
      <tr>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="b-left" name="arrow down" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="back" name="arrow down" />
            </Button.Content>
          </Button>
        </td>
        <td>
          <Button
            onClick={() =>
              props.addDirection(`go 0 0 ${props.distance} ${props.speed}`)
            }
          >
            <Button.Content visible>
              <Icon className="b-right" name="arrow down" />
            </Button.Content>
          </Button>
        </td>
      </tr>
    </table>
  );
};

export default CurrentPlane;
