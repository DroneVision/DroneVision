import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatusContainer from '../components/StatusContainer';
import DroneTelemetry from '../components/DroneTelemetry';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';
import { Button, Grid, Header, Icon, Input, Modal } from "semantic-ui-react";
import PubSub from 'pubsub-js';
import wait from 'waait';
import { drawPath } from '../utils/drawPathUtils';
import { updateCDP } from '../store/store';
import commandDelays from '../drone/commandDelays';

const { ipcRenderer } = window.require('electron');

class Run extends Component {
  constructor() {
    super();

    this.state = {
      duration: 10,
      invalidVideoTime: false,
      testRunButton: false,
    };
  }

  componentDidMount() {
    drawPath(this.props.flightInstructions, this.props.distance);
  }

  connectToDroneHandler = () => {
    ipcRenderer.send("connect-to-drone");
  };

  startRecordingVideo = () => {
    let durationToSend = this.state.duration;
    if (durationToSend < 10) {
      this.setState({ invalidVideoTime: true });
    } else {
      ipcRenderer.send("start-recording", parseInt(durationToSend));
    }
  };

  stopRecordingVideo = () => {
    ipcRenderer.send("stop-recording");
  };

  moveSphere = () => {
    PubSub.publish('move-sphere');
  };

  handleDurationChange = event => {
    this.setState({ duration: event.target.value });
  };

  flightCommandsIteratorReduxUpdater = async flightInstructions => {
    //disable Test Run Button
    this.setState({ testRunButton: true });

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
          this.props.updateCDP({
            x: this.props.startingPosition.x,
            y: this.props.startingPosition.y,
            z: this.props.startingPosition.z,
          });

          this.setState({ testRunButton: false });
        }, 10000);
      } else {
        this.props.updateCDP(newCoords);
      }
      //Wait for Command Delay
      await wait(commandDelays[instructionName]);
    }
  };

  runFlightInstructions = () => {
    const { flightInstructions } = this.props;
    const droneInstructions = flightInstructions.map(
      flightInstructionObj => flightInstructionObj.instruction
    );
    console.log("sending auto pilot to drone", droneInstructions);

    ipcRenderer.send('autopilot', ['command', ...droneInstructions]);
    console.log('this.props.flightInstructions', this.props.flightInstructions);
    this.flightCommandsIteratorReduxUpdater(this.props.flightInstructions);
  };


  closeInvalidVideoTime = () => {
    this.setState({ invalidVideoTime: false });
  }

  render() {
    return (
      <div id="run">
        <Grid padded>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h1" dividing id="ap-header">
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
              <Header as="h1" dividing id="ap-header">
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
              <Header as="h1" dividing id="ap-header">
                <Icon name="rocket" />
                <Header.Content>
                  Test
                  <Header.Subheader>
                    <i>Test your flight path</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h1" dividing id="ap-header">
                <Icon name="video camera" />
                <Header.Content>
                  Record Video
                  <Header.Subheader>
                    Recording status: <Icon name="circle" color="red" />
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                color="facebook"
                labelPosition="left"
                icon="military"
                content="Test your Flight Path"
                disabled={this.state.testRunButton}
                onClick={this.runFlightInstructions}
              />
              <Button onClick={() => this.moveSphere()}>Move Sphere</Button>
            </Grid.Column>

            <Grid.Column>
              <Input
                action={
                  <Button
                    color="facebook"
                    labelPosition="left"
                    icon="play"
                    content="Start Recording"
                    onClick={() => this.startRecordingVideo()}
                  />
                }
                actionPosition="left"
                placeholder="10 seconds"
                defaultValue="10"
                label="seconds"
                labelPosition="right"
                type="number"
                onChange={this.handleDurationChange}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column />

            <Grid.Column>
              <Button onClick={() => this.stopRecordingVideo()}>
                Reset Video Recorder
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Modal
          size="mini"
          open={this.state.invalidVideoTime}
          onClose={this.closeInvalidVideoTime}
        >
          <Modal.Header>Error</Modal.Header>
          <Modal.Content>
            <p>Video must be at least 10 seconds long.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              negative
              icon="checkmark"
              labelPosition="center"
              content="Ok"
              onClick={this.closeInvalidVideoTime}
            />
          </Modal.Actions>
        </Modal>
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
