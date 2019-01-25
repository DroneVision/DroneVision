import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const UpPlane = props => {
  return (
    <table>
      <tbody>
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
                <Icon className="straight-up" name="arrow circle up" />
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
      </tbody>
    </table>
  );
};

export default UpPlane;
