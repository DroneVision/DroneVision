import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import Canvas from '../components/Canvas';
import {
  Button,
  Grid,
  Header,
  Icon,
} from 'semantic-ui-react';
import wait from 'waait';
import { drawPath } from '../utils/drawPathUtils';
import { updateCDP } from '../store/store';
import commandDelays from '../drone/commandDelays';

const { ipcRenderer } = window.require('electron');

class Run extends Component {
  constructor() {
    super();

    this.state = {
      runButtonsDisabled: false,
      isRecording: false,
    };
  }

  componentDidMount() {
    drawPath(this.props.flightInstructions, this.props.distance);
  }

  connectToDroneHandler = () => {
    ipcRenderer.send('connect-to-drone');
  };

  startRecordingVideo = () => {
    ipcRenderer.send('start-recording');
  };

  stopRecordingVideo = () => {
    ipcRenderer.send('stop-recording');
  };

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //Iterate over all flightInstructions
    for (let i = 0; i < flightInstructions.length; i++) {
      let flightInstruction = flightInstructions[i];
      let instructionName = flightInstruction.instruction.split(' ')[0];
      //create new object for new coordinates
      let newCoords = {};
      let flightInstructionArray = flightInstruction.instruction
        .split(' ')
        .slice(1, 4)
        .map(numStr => Number(numStr) / this.props.distance);

      const [z, x, y] = flightInstructionArray;
      // x -> z
      // y -> x
      // z -> y
      newCoords.x = this.props.currentDronePosition.x + x;
      newCoords.y = this.props.currentDronePosition.y + y;
      newCoords.z = this.props.currentDronePosition.z + z;

      if (instructionName === 'command') {
      } else if (instructionName === 'takeoff') {
        this.props.updateCDP({
          x: this.props.startingPosition.x,
          y: this.props.startingPosition.y + 1,
          z: this.props.startingPosition.z,
        });
      } else if (instructionName === 'land') {
        this.props.updateCDP({
          x: this.props.currentDronePosition.x,
          y: 0 + this.props.voxelSize * -0.5,
          z: this.props.currentDronePosition.z,
        });

        setTimeout(() => {
          //After flight completes wait 10 seconds
          //Send drone model back to starting position
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });
          //If user was recording, stop video encoding and stop streaming
          if (this.state.isRecording) {
            this.stopRecordingVideo();
          }
          //Give the 'Send drone model back to starting
          //position 4.5 seconds to animate before re-enabling buttons
          setTimeout(() => {
            this.setState({ runButtonsDisabled: false, isRecording: false });
          }, 4500);
        }, 10000);
      } else {
        this.props.updateCDP(newCoords);
      }
      //Wait for Command Delay
      await wait(commandDelays[instructionName]);
    }
  };

  runFlightInstructions = () => {
    //Diable Buttons
    this.setState({ runButtonsDisabled: true });
    //Prepare variables for flight
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    //Fly drone
    ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
    //Animate 3D drone model on Canvas
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };

  runFlightInstructionsAndRecord = () => {
    //Disable Buttons
    this.setState({ runButtonsDisabled: true, isRecording: true });
    //Start Recording
    this.startRecordingVideo();
    //Prepare variables for flight
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    //Wait 5 Seconds, then fly the drone (gives camera time to initialize)
    setTimeout(() => {
      //Fly drone
      ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
      //Animate 3D drone model on Cavnas
      this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
    }, 5000);
  };

  closeInvalidVideoTime = () => {
    this.setState({ invalidVideoTime: false });
  };

  render() {
    return (
      <div id="run">
        <Grid padded>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="paper plane" />
                <Header.Content>
                  AutoPilot
                  <Header.Subheader>
                    <i>Visualize your build path</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="cloudscale" />
                <Header.Content>
                  Drone Telemetry
                  <Header.Subheader>
                    <i>Real-Time UAV Telemetry</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Canvas />
            </Grid.Column>

            <Grid.Column>
              <DroneTelemetry />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="rocket" />
                <Header.Content>
                  Run Flight
                  <Header.Subheader>
                    <i>Fly your drone</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="video camera" />
                <Header.Content>
                  Record Video
                  <Header.Subheader>
                    {this.state.isRecording ? 'Recording: ' : null}
                    {this.state.isRecording ? (
                      <Icon name="circle" color="red" />
                    ) : (
                      'Record a video of your flight path'
                    )}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column id="centered">
              <Button
                disabled={this.state.runButtonsDisabled}
                color="facebook"
                labelPosition="left"
                icon="military"
                content="Run Flight"
                onClick={this.runFlightInstructions}
              />
            </Grid.Column>

            <Grid.Column id="centered">
              <Button
                disabled={this.state.runButtonsDisabled}
                color="facebook"
                labelPosition="left"
                icon="play"
                content="Record Flight"
                onClick={this.runFlightInstructionsAndRecord}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1}>
            <Grid.Column id="centered">
              <StatusContainer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    flightInstructions: state.flightInstructions,
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
  };
};

const mapDispatch = dispatch => {
  return {
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(Run);
