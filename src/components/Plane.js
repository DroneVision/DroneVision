import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const getInstruction = (name, distance, speed, type) => {
  let xyz;
  let z;
  switch (type) {
    case 'current':
      z = 0;
      break;
    case 'up':
      z = distance;
      break;
    case 'down':
      z = -distance;
      break;
    default:
      z = null;
  }
  switch (name) {
    case 'forward-left':
      xyz = `${distance} ${distance} ${z}`;
      break;
    case 'forward':
      xyz = `${distance} 0 ${z}`;
      break;
    case 'forward-right':
      xyz = `${distance} -${distance} ${z}`;
      break;
    case 'left':
      xyz = `0 ${distance} ${z}`;
      break;
    case 'right':
      xyz = `0 -${distance} ${z}`;
      break;
    case 'reverse-left':
      xyz = `-${distance} ${distance} ${z}`;
      break;
    case 'reverse':
      xyz = `-${distance} 0 ${z}`;
      break;
    case 'reverse-right':
      xyz = `-${distance} -${distance} ${z}`;
      break;
    case 'straight-up':
      xyz = `0 0 ${z}`;
      break;
    case 'straight-down':
      xyz = `0 0 ${z}`;
      break;
    default:
      xyz = '';
  }
  return `go ${xyz} ${speed}`;
};

const renderCenterButton = (type, distance, speed, addDirection) => {
  switch (type) {
    case 'current':
      return (
        <Button onClick={() => addDirection(`hold`)}>
          <Button.Content visible>
            <Icon className="hold" name="hourglass half" />
          </Button.Content>
        </Button>
      );
    case 'up':
      return (
        <Button
          onClick={() =>
            addDirection(getInstruction('straight-up', distance, speed, type))
          }
        >
          <Button.Content visible>
            <Icon className="straight-up" name="arrow circle up" />
          </Button.Content>
        </Button>
      );
    case 'down':
      return (
        <Button
          onClick={() =>
            addDirection(getInstruction('straight-down', distance, speed, type))
          }
        >
          <Button.Content visible>
            <Icon className="straight-down" name="arrow circle down" />
          </Button.Content>
        </Button>
      );
    default:
      return null;
  }
};

const Plane = props => {
  const { type, distance, speed, addDirection } = props;
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
                addDirection(
                  getInstruction('forward-left', distance, speed, type)
                )
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
                addDirection(getInstruction('forward', distance, speed, type))
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
                addDirection(
                  getInstruction('forward-right', distance, speed, type)
                )
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
                addDirection(getInstruction('left', distance, speed, type))
              }
            >
              <Button.Content visible>
                <Icon className="left" name="arrow left" />
              </Button.Content>
            </Button>
          </td>
          <td>{renderCenterButton(type, distance, speed, addDirection)}</td>
          <td>
            <Button
              onClick={() =>
                addDirection(getInstruction('right', distance, speed, type))
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
                addDirection(
                  getInstruction('reverse-left', distance, speed, type)
                )
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
                addDirection(getInstruction('reverse', distance, speed, type))
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
                addDirection(
                  getInstruction('reverse-right', distance, speed, type)
                )
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

export default Plane;
