import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

//Default Commands for North (N), West (W), South (S), East (E) assuming the drone is facing forward towards the north star
const dirs = [
  [1, 0, 0], // North
  [0, 1, 0], // West
  [-1, 0, 0], // South
  [0, -1, 0], // East
  [0, 0, 0], // Null
  [0, 0, 1], // Up
  [0, 0, -1], // Down
];
const dirStrs = ['Forward', 'Left', 'Reverse', 'Right', null, 'Up', 'Down'];

const dirMap = {
  N: 0,
  W: 1,
  S: 2,
  E: 3,
  C: 4,
  U: 5,
  D: 6,
};

function combineArrays() {
  let arrays = arguments,
    results = [],
    count = arrays[0].length,
    L = arrays.length,
    sum,
    next = 0,
    i;
  while (next < count) {
    sum = 0;
    i = 0;
    while (i < L) {
      sum += Number(arrays[i++][next]);
    }
    results[next++] = sum;
  }
  return results;
}

const getFlightInstruction = (dirString, droneOrientation = 0) => {
  const droneInstruction = getDroneInstruction(dirString, droneOrientation);
  const drawInstruction = getDrawInstruction(dirString);
  const message = getMessage(dirString, droneOrientation);

  return { droneInstruction, drawInstruction, message };
};

const getDrawInstruction = dirString => {
  return combineArrays(...dirString.split('').map(dir => dirs[dirMap[dir]]));
};

const getDroneInstruction = (dirString, droneOrientation) => {
  return combineArrays(
    ...dirString.split('').map(dir => {
      if (dirMap[dir] >= 4) {
        // Current (C), Up (U), or Down (D)
        return dirs[dirMap[dir]];
      } else {
        // All other directions
        return dirs[(dirMap[dir] + droneOrientation) % 4];
      }
    })
  );
};

const getMessage = (dirString, droneOrientation) => {
  return dirString
    .split('')
    .filter(dir => dir !== 'C')
    .map(dir => {
      if (dirMap[dir] >= 4) {
        //Up (U) or Down (D)
        return dirStrs[dirMap[dir]];
      } else {
        return dirStrs[(dirMap[dir] + droneOrientation) % 4];
      }
    })
    .join(' + ');
};

const renderCenterButton = (
  type,
  addFlightInstruction,
  allDisabled,
  droneOrientation
) => {
  switch (type) {
    case 'C':
      return (
        <Button
          disabled={allDisabled}
          onClick={() =>
            addFlightInstruction({ instruction: 'hold', message: 'Hold' })
          }
        >
          <Button.Content visible>
            <Icon
              className={`drone${droneOrientation}`}
              name="hourglass half"
            />
          </Button.Content>
        </Button>
      );
    case 'U':
      return (
        <Button
          disabled={allDisabled}
          onClick={() => addFlightInstruction(getFlightInstruction(type), `Up`)}
        >
          <Button.Content visible>
            <Icon className="straight-up" name="arrow circle up" />
          </Button.Content>
        </Button>
      );
    case 'D':
      return (
        <Button
          disabled={allDisabled}
          onClick={() =>
            addFlightInstruction(getFlightInstruction(type), `Down`)
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

const ButtonPanel = props => {
  const {
    type,
    addFlightInstruction,
    leftDisabled,
    rightDisabled,
    forwardDisabled,
    reverseDisabled,
    allDisabled,
    droneOrientation,
  } = props;

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
              disabled={leftDisabled || forwardDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}NW`, droneOrientation)
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
              disabled={forwardDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}N`, droneOrientation)
                )
              }
            >
              <Button.Content visible>
                <Icon className="forward" name="arrow up" />
              </Button.Content>
            </Button>
          </td>
          <td>
            <Button
              disabled={rightDisabled || forwardDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}NE`, droneOrientation)
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
              disabled={leftDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}W`, droneOrientation)
                )
              }
            >
              <Button.Content visible>
                <Icon className="left" name="arrow left" />
              </Button.Content>
            </Button>
          </td>
          <td>
            {renderCenterButton(
              type,
              addFlightInstruction,
              allDisabled,
              droneOrientation
            )}
          </td>
          <td>
            <Button
              disabled={rightDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}E`, droneOrientation)
                )
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
              disabled={leftDisabled || reverseDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}SW`, droneOrientation)
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
              disabled={reverseDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}S`, droneOrientation)
                )
              }
            >
              <Button.Content visible>
                <Icon className="back" name="arrow down" />
              </Button.Content>
            </Button>
          </td>
          <td>
            <Button
              disabled={rightDisabled || reverseDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction(
                  getFlightInstruction(`${type}SE`, droneOrientation)
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

export default ButtonPanel;
