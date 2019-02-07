import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import wait from 'waait';
import commandDelays from '../drone/commandDelays';

import {
  Button,
  Icon,
  List,
  Segment,
  Header,
  Grid,
  Image,
  Modal,
} from 'semantic-ui-react';

import ButtonPanel from '../components/ButtonPanel';
import BuildCanvas from '../components/BuildCanvas';
import PreVisCanvas from '../components/PreVisCanvas';

import {
  changeTab,
  updateInstructions,
  clearInstructions,
  updateCDP,
  updateCDR,
  toggleObstacles,
  updateDroneConnectionStatus,
  rotateDrone,
  togglePreVisualizeAnimation,
} from '../store/store';

import { getFlightInstruction } from '../utils/buttonPanelUtils';

class Build extends Component {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.state = {
      limits: {
        maxX: scale / 2,
        maxY: scale,
        maxZ: scale / 2,
        minX: -scale / 2,
        minY: 1,
        minZ: -scale / 2,
      },
      buttonPlane: 'Current',
      startingPoint: { x: 0, y: 1, z: 0 },
      preVisButtonsDisabled: false,
      helpOpen: false,
    };
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }
  handleKeyDown = evt => {
    if (evt.keyCode === 90 || evt.keyCode === 190) {
      //'z' and '.' key -> Activate Up Plane
      this.setState({ buttonPlane: 'Up' });
    } else if (evt.keyCode === 88 || evt.keyCode === 191) {
      //'x' and '/' key -> Activate Down Plane
      this.setState({ buttonPlane: 'Down' });
    }
    // else if (evt.keyCode === 68 || evt.keyCode === 74) {
    //   //'d' and 'j' key -> Rotate counter-clockwise
    //   this.addRotationInstruction('ccw');
    // } else if (evt.keyCode === 70 || evt.keyCode === 75) {
    //   //'f' and 'k' key -> Rotate clockwise
    //   this.addRotationInstruction('cw');
    // }
  };
  handleKeyUp = () => {
    this.setState({ buttonPlane: 'Current' });
  };

  addFlightInstruction = instructionObj => {
    const { flightInstructions, speed, distance } = this.props;
    const {
      droneInstruction: newDroneInstruction,
      drawInstruction: newDrawInstruction,
      message: newFlightMessage,
    } = instructionObj;
    const lastInstructionObj =
      flightInstructions[flightInstructions.length - 2];
    const {
      droneInstruction: lastDroneInstruction,
      drawInstruction: lastDrawInstruction,
      message: lastMessage,
    } = lastInstructionObj;

    const lastMessageName = lastMessage
      .split(' ')
      .slice(0, -3)
      .join(' ');

    const lastDroneInstructionArr = lastDroneInstruction.split(' ');
    const lastSpeed = Number(
      lastDroneInstructionArr[lastDroneInstructionArr.length - 1]
    );

    const flightInstructionObj = {};

    let updatedFlightInstructions = flightInstructions.slice();
    if (newFlightMessage === lastMessageName && speed === lastSpeed) {
      // Redundant instruction, so just adjust the last one's values
      if (newDroneInstruction === 'hold') {
        // TODO: add logic for hold
      } else {
        //Updating drone instruction
        const lastDroneInstructionCoords = lastDroneInstruction
          .split(' ')
          .slice(1, 4);

        const resultDroneCoords = lastDroneInstructionCoords.map(
          (coord, idx) => {
            return Number(coord) + newDroneInstruction[idx] * distance * 100;
          }
        );
        const updatedDroneInstruction = `go ${resultDroneCoords.join(
          ' '
        )} ${speed}`;
        flightInstructionObj.droneInstruction = updatedDroneInstruction;

        //Updating draw instruction
        const newDrawCoords = lastDrawInstruction.map(
          (coord, idx) => coord + newDrawInstruction[idx]
        );
        flightInstructionObj.drawInstruction = newDrawCoords;

        //Updating instruction message
        const lastDistance = Number(lastMessage.split(' ').slice(-2, -1)[0]);
        const resultDistance = lastDistance + distance;
        const newMessage = `${newFlightMessage} --> ${resultDistance.toFixed(
          1
        )} m`;
        flightInstructionObj.message = newMessage;
      }
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      flightInstructionObj.droneInstruction = `go ${newDroneInstruction
        .map(numStr => Number(numStr) * distance * 100)
        .join(' ')} ${speed}`;
      flightInstructionObj.drawInstruction = newDrawInstruction;
      flightInstructionObj.message = `${newFlightMessage} --> ${distance} m`;
      //New flight instruction (non-duplicate), so add it in
      updatedFlightInstructions.splice(-1, 0, flightInstructionObj);
    }
    this.props.updateInstructions(updatedFlightInstructions);
  };

  addRotationInstruction = (direction, degs = 90) => {
    const { flightInstructions, droneOrientation } = this.props;
    const lastInstructionObj =
      flightInstructions[flightInstructions.length - 2];

    const { droneInstruction: lastDroneInstruction } = lastInstructionObj;

    const newMessage =
      direction === 'cw' ? `Rotate Clockwise` : `Rotate Counter-Clockwise`;

    const flightInstructionObj = {};

    let updatedFlightInstructions = flightInstructions.slice();

    const [lastInstruction, lastDegs] = lastDroneInstruction.split(' ');

    //avoids sending duplicate commands unless the combination would push it above the maximum allowable rotation command of 360 degrees
    if (direction === lastInstruction && Number(lastDegs) <= 360 - degs) {
      const resultDegs = degs + Number(lastDegs);
      flightInstructionObj.droneInstruction = `${direction} ${resultDegs}`;
      flightInstructionObj.message = `${newMessage} --> ${resultDegs} degrees`;
      flightInstructionObj.drawInstruction = `${direction} ${resultDegs}`;
      //Overwrite the existing flight instruction object
      updatedFlightInstructions.splice(-2, 1, flightInstructionObj);
    } else {
      flightInstructionObj.droneInstruction = `${direction} ${degs}`;
      flightInstructionObj.message = `${newMessage} --> ${degs} degrees`;
      flightInstructionObj.drawInstruction = `${direction} ${degs}`;
      //New flight instruction (non-duplicate), so add it in
      updatedFlightInstructions.splice(-1, 0, flightInstructionObj);
    }

    this.props.updateInstructions(updatedFlightInstructions);

    let newOrientation;
    if (direction === 'cw') {
      newOrientation = (droneOrientation + 1) % 4;
    } else {
      //counter-clockwise
      newOrientation = (droneOrientation + 3) % 4;
    }
    this.props.rotateDrone(newOrientation);
  };

  deleteLastInstruction = () => {
    const { flightInstructions, droneOrientation } = this.props;
    let updatedFlightInstructions = flightInstructions.slice();

    const removedInstruction = updatedFlightInstructions.splice(-2, 1);

    //TODO: update droneRotation if the last instruction was a rotation
    const [command, amount] = removedInstruction[0].droneInstruction.split(' ');

    if (command === 'cw') {
      const newOrientation =
        (droneOrientation + (3 + Number(amount) / 90 - 1)) % 4;
      this.props.rotateDrone(newOrientation);
    } else if (command === 'ccw') {
      //counter-clockwise
      const newOrientation =
        (droneOrientation + (1 + Number(amount) / 90 - 1)) % 4;
      this.props.rotateDrone(newOrientation);
    }

    this.props.updateInstructions(updatedFlightInstructions);
  };

  clearFlightInstructions = () => {
    this.props.rotateDrone(0);
    this.props.clearInstructions();
  };

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //Iterate over all flightInstructions
    for (let i = 0; i < flightInstructions.length; i++) {
      let animateInstruction = flightInstructions[i].drawInstruction;
      if (animateInstruction === 'takeoff') {
        this.props.updateCDP({
          x: this.props.startingPosition.x,
          y: this.props.startingPosition.y + 1,
          z: this.props.startingPosition.z,
        });
        await wait(commandDelays.takeoff);
        console.log('takeoff', animateInstruction);
      } else if (animateInstruction === 'land') {
        this.props.updateCDP({
          x: this.props.currentDronePosition.x,
          y: 0 + this.props.voxelSize * -0.5,
          z: this.props.currentDronePosition.z,
        });
        console.log('land', animateInstruction);
        setTimeout(() => {
          //After flight completes wait 10 seconds
          //Send drone model back to starting position
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });
          this.setState({
            preVisButtonsDisabled: false,
          });
          this.props.togglePreVisualizeAnimation();
          this.props.updateCDR(Math.PI);
        }, 10000);
      } else if (Array.isArray(animateInstruction)) {
        //create new object for new coordinates
        let newCoords = {};
        const [z, x, y] = animateInstruction;
        // x -> z
        // y -> x
        // z -> y
        newCoords.x = this.props.currentDronePosition.x + x;
        newCoords.y = this.props.currentDronePosition.y + y;
        newCoords.z = this.props.currentDronePosition.z + z;

        this.props.updateCDP(newCoords);
        console.log('other', animateInstruction);

        //Wait for Command Delay
        await wait(commandDelays.go);
      } else {
        //Handle Rotation
        const [rotationDirection, rotationDegrees] = animateInstruction.split(
          ' '
        );

        const rotationDegreesNumber = Number(rotationDegrees);
        const rotationAngles = {
          90: Math.PI / 2,
          180: Math.PI,
          270: Math.PI + Math.PI / 2,
        };

        if (rotationDirection === 'cw') {
          const newCWRotation =
            this.props.currentDroneRotation -
            rotationAngles[rotationDegreesNumber];
          await this.props.updateCDR(newCWRotation);
        } else {
          const newCCWRotation =
            this.props.currentDroneRotation +
            rotationAngles[rotationDegreesNumber];
          await this.props.updateCDR(newCCWRotation);
        }
        await wait(commandDelays.cw);
      }
    }
  };

  preVisualizePath = async () => {
    // Disable Buttons
    this.setState({ preVisButtonsDisabled: true });
    await this.props.togglePreVisualizeAnimation();
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  stopPreVisualization = () => {
    this.setState({
      preVisButtonsDisabled: false,
    });
    this.props.togglePreVisualizeAnimation();
    this.props.updateCDR(Math.PI);
  };

  handleButtonClick = (dirString, droneOrientation = 0) => {
    this.addFlightInstruction(
      getFlightInstruction(dirString, droneOrientation)
    );
    this.updateScroll();
  };

  updateScroll = () => {
    const instructions = document.getElementById('flight-instructions');
    instructions.scrollTop = instructions.scrollHeight;
  };

  buildHelp = () => this.setState({ helpOpen: true });
  handleClose = () => this.setState({ helpOpen: false });

  render() {
    const { limits, buttonPlane } = this.state;
    const {
      flightInstructions,
      droneOrientation,
      buildDronePosition,
    } = this.props;
    let leftDisabled, rightDisabled, forwardDisabled, reverseDisabled;
    if (droneOrientation === 0) {
      leftDisabled = buildDronePosition.x === limits.maxX;
      rightDisabled = buildDronePosition.x === limits.minX;
      forwardDisabled = buildDronePosition.z === limits.maxZ;
      reverseDisabled = buildDronePosition.z === limits.minZ;
    } else if (droneOrientation === 1) {
      leftDisabled = buildDronePosition.z === limits.maxX;
      rightDisabled = buildDronePosition.z === limits.minX;
      forwardDisabled = buildDronePosition.x === limits.minZ;
      reverseDisabled = buildDronePosition.x === limits.maxZ;
    } else if (droneOrientation === 2) {
      leftDisabled = buildDronePosition.x === limits.minX;
      rightDisabled = buildDronePosition.x === limits.maxX;
      forwardDisabled = buildDronePosition.z === limits.minZ;
      reverseDisabled = buildDronePosition.z === limits.maxZ;
    } else {
      leftDisabled = buildDronePosition.z === limits.minX;
      rightDisabled = buildDronePosition.z === limits.maxX;
      forwardDisabled = buildDronePosition.x === limits.maxZ;
      reverseDisabled = buildDronePosition.x === limits.minZ;
    }

    const upDisabled =
      buildDronePosition.y === limits.maxY && buttonPlane === 'Up';
    const downDisabled =
      buildDronePosition.y === limits.minY && buttonPlane === 'Down';
    return (
      <div id="build-screen">
        <Grid columns={3} padded centered>
          <Header as="h1" dividing id="centered-padded-top">
            <Icon name="settings" />
            <Header.Content>
              AutoPilot Builder
              <Header.Subheader>
                <i>Visualize your build path</i>
              </Header.Subheader>
            </Header.Content>
          </Header>

          <Grid.Row>
            <Grid.Column>
              {this.props.preVisualizeAnimation ? (
                <PreVisCanvas />
              ) : (
                <BuildCanvas />
              )}
            </Grid.Column>
          </Grid.Row>

          <div id="row">
            <div id="button-panels">
              <table>
                <thead align="center">
                  <tr>
                    <td>
                      <h1>
                        {buttonPlane === 'Current' ? null : `${buttonPlane} +`}
                      </h1>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td id={`${buttonPlane}-strafe`}>
                      <ButtonPanel
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={
                          this.state.preVisButtonsDisabled ||
                          upDisabled ||
                          downDisabled
                        }
                        clickHandler={this.handleButtonClick}
                        type={buttonPlane[0]}
                        droneOrientation={droneOrientation}
                        screen="path"
                      />
                    </td>

                    <div id="build-help">
                      <Icon
                        name="question circle"
                        size="large"
                        onClick={this.buildHelp}
                      />
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <table>
              <tbody>
                <tr>
                  <td>
                    <Button
                      disabled={this.state.preVisButtonsDisabled}
                      onClick={() => this.addRotationInstruction('ccw')}
                    >
                      <Button.Content visible>
                        <Icon name="undo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </td>
                  <td>
                    <Button
                      disabled={this.state.preVisButtonsDisabled}
                      onClick={() => this.addRotationInstruction('cw')}
                    >
                      <Button.Content visible>
                        <Icon name="redo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="flight-instructions">
            <Segment inverted>
              <List divided inverted animated>
                <List.Header>
                  <i>Flight Instructions</i>
                </List.Header>
                {flightInstructions
                  .map(instructionObj => instructionObj.message)
                  .map((message, ind) => {
                    let icon;
                    if (message === 'Takeoff') {
                      icon = 'hand point up';
                    } else if (message === 'Land') {
                      icon = 'hand point down';
                    } else if (message === 'Hold') {
                      icon = 'hourglass half';
                    } else {
                      icon = 'dot circle';
                    }
                    return (
                      <List.Item
                        className="flight-message-single"
                        key={ind}
                        content={message}
                        icon={icon}
                      />
                    );
                  })}
              </List>
            </Segment>
          </div>

          <div className="row">
            <Button
              disabled={
                flightInstructions.length <= 2 ||
                this.state.preVisButtonsDisabled
              }
              onClick={() => this.deleteLastInstruction()}
            >
              Delete Last Instruction
            </Button>
            <Button
              disabled={
                flightInstructions.length <= 2 ||
                this.state.preVisButtonsDisabled
              }
              onClick={() => this.clearFlightInstructions()}
            >
              Clear All Instructions
            </Button>
          </div>

          <div className="row">
            <Link to={'/autopilot'}>
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={() => this.props.changeTab('autopilot')}
              >
                Run Autopilot/Record Video
              </Button>
            </Link>
            <Button
              disabled={this.state.preVisButtonsDisabled}
              onClick={this.preVisualizePath}
            >
              Pre-Visualize Path
            </Button>
            {/* <Button
              disabled={!this.state.preVisButtonsDisabled}
              onClick={this.preVisualizePath}
            >
              Stop Pre-Visualization
            </Button> */}
            {this.props.obstacles ? (
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={this.props.toggleObstacles}
              >
                Remove Obstacles
              </Button>
            ) : (
              <Button
                disabled={this.state.preVisButtonsDisabled}
                onClick={this.props.toggleObstacles}
              >
                Insert Obstacles
              </Button>
            )}
          </div>
        </Grid>
        <Modal
          open={this.state.helpOpen}
          onClose={this.handleClose}
          basic
          size="mini"
        >
          <Header icon="info" content="Build Controls" />
          <Modal.Content>
            <Image
              src={require('../assets/images/helper-images/build-instructions.png')}
              size="large"
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleClose} inverted>
              <Icon name="checkmark" /> Got it
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    speed: state.speed,
    scale: state.scale,
    flightInstructions: state.flightInstructions,
    droneOrientation: state.droneOrientation,
    currentDronePosition: state.currentDronePosition,
    currentDroneRotation: state.currentDroneRotation,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    droneConnectionStatus: state.droneConnectionStatus,
    buildDronePosition: state.buildDronePosition,
    preVisualizeAnimation: state.preVisualizeAnimation,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    clearInstructions: () => dispatch(clearInstructions()),
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
    updateCDR: newRotation => {
      dispatch(updateCDR(newRotation));
    },
    toggleObstacles: () => {
      dispatch(toggleObstacles());
    },
    updateDroneConnectionStatus: droneStatus =>
      dispatch(updateDroneConnectionStatus(droneStatus)),
    rotateDrone: newOrientation => {
      dispatch(rotateDrone(newOrientation));
    },
    updateInstructions: updatedFlightInstructions =>
      dispatch(updateInstructions(updatedFlightInstructions)),
    togglePreVisualizeAnimation: () => dispatch(togglePreVisualizeAnimation()),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Build);
