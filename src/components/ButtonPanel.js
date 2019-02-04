import React from 'react';
import { Button, Icon, Image } from 'semantic-ui-react';


const renderCenterButton = (
  type,
  addFlightInstruction,
  allDisabled,
  droneOrientation
) => {
  switch (type) {
    case 'C':
      return (
        <Image
          className={`drone${droneOrientation}`}
          src={require('../assets/images/helper-images/top-view-up.png')}
          size="small"
        />
      );
    case 'U':
      return (
        <Button
          disabled={allDisabled}
          onClick={() => addFlightInstruction(getFlightInstruction(type))}
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
            addFlightInstruction(getFlightInstruction(type))
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
    clickHandler
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
              onClick={()=> clickHandler(`${type}NW`, droneOrientation)}  
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
