import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const renderCenterButton = (type, addFlightInstruction, allDisabled) => {
  switch (type) {
    case 'Current':
      return (
        <Button
          disabled={allDisabled}
          onClick={() => addFlightInstruction('hold', 'Hold')}
        >
          <Button.Content visible>
            <Icon className="hold" name="hourglass half" />
          </Button.Content>
        </Button>
      );
    case 'Up':
      return (
        <Button
          disabled={allDisabled}
          onClick={() => addFlightInstruction([0, 0, 1], `Up --> `)}
        >
          <Button.Content visible>
            <Icon className="straight-up" name="arrow circle up" />
          </Button.Content>
        </Button>
      );
    case 'Down':
      return (
        <Button
          disabled={allDisabled}
          onClick={() => addFlightInstruction([0, 0, -1], `Down --> `)}
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
  } = props;

  let prefix, zCommand;
  if (type === 'Current') {
    prefix = 'Current';
    zCommand = 0;
  } else if (type === 'Up') {
    prefix = 'Up + ';
    zCommand = 1;
  } else if (type === 'Down') {
    prefix = 'Down';
    zCommand = -1;
  }
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
                  [1, 1, zCommand],
                  `${prefix}Forward + Left --> `
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
                addFlightInstruction([1, 0, zCommand], `${prefix}Forward --> `)
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
                  [1, -1, zCommand],
                  `${prefix}Forward + Right --> `
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
                addFlightInstruction([0, 1, zCommand], `${prefix}Left --> `)
              }
            >
              <Button.Content visible>
                <Icon className="left" name="arrow left" />
              </Button.Content>
            </Button>
          </td>
          <td>{renderCenterButton(type, addFlightInstruction, allDisabled)}</td>
          <td>
            <Button
              disabled={rightDisabled || allDisabled}
              onClick={() =>
                addFlightInstruction([0, -1, zCommand], `${prefix}Right --> `)
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
                  [-1, 1, zCommand],
                  `${prefix}Reverse + Left --> `
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
                addFlightInstruction([-1, 0, zCommand], `${prefix}Reverse --> `)
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
                  [-1, -1, zCommand],
                  `${prefix}Reverse + Right --> `
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
