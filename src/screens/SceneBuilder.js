import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  Button,
  Icon,
  List,
  Segment,
  Header,
  Grid,
  Image,
} from 'semantic-ui-react';

import ButtonPanel from '../components/ButtonPanel';
import SceneCanvas from '../components/SceneCanvas';
import {
  changeTab,
  updateInstructions,
  clearInstructions,
  updateCDP,
  toggleObstacles,
  updateDroneConnectionStatus,
  rotateDrone,
  addObjectToScene
} from '../store/store';

const { ipcRenderer } = window.require('electron');

class SceneBuilder extends Component {
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
      startingPoint: { x: 0, y: 1, z: 0 },
      selectedObject: {
        name: '',
        length: 2,
        width: 2,
        height: 2,
        position: {
          x: 0, y: 0, z: 0
        }
      },
    };
  }

  componentDidMount() {
    // Listen for flight import from main process
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
    });
    // Listen for request for flight instructions from main process
    ipcRenderer.on('request-flightInstructions', event => {
      // Reply back with instructions
      ipcRenderer.send(
        'send-flightInstructions',
        this.props.flightInstructions
      );
    });
    ipcRenderer.on('drone-connection', (event, droneConnectionStatus) => {
      this.props.updateDroneConnectionStatus(droneConnectionStatus);
      // Send a command to drone
      ipcRenderer.send('single-instruction', 'command');
    });
  }

  render() {
    const { limits } = this.state;
    const { flightInstructions, distance, droneOrientation } = this.props;

    const latestInstructionMessage =
      flightInstructions[flightInstructions.length - 2].message;
    const currentPoint = { x: 10, y: 10, z: 10 };
    const leftDisabled = currentPoint.x === limits.maxX;
    const rightDisabled = currentPoint.x === limits.minX;
    const forwardDisabled = currentPoint.z === limits.maxZ;
    const reverseDisabled = currentPoint.z === limits.minZ;
    const upDisabled = currentPoint.y === limits.maxY;
    const downDisabled = currentPoint.y === limits.minY;
    return (
      <div id="build-screen">
        <Grid columns={3} padded>
          <Grid.Row>
            <Grid.Column width={3}>
              <Grid.Row>
                <Image
                  src={require('../assets/images/helper-images/build-instructions.png')}
                  size="large"
                />
              </Grid.Row>
              <Grid.Row>
                <Button onClick={() => this.addObjectToScene(this.state.selectedObject)}>
                  <Button.Content visible>
                    <Icon name="plus" />
                    Create New Object
                  </Button.Content>
                </Button>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={9}>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="building" />
                <Header.Content>
                  Scene Builder
                  <Header.Subheader>
                    <i>Add objects to your scene</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>

              <Grid.Row>
                <Grid.Column>
                  <SceneCanvas />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid columns={3} padded centered>
                  <Grid.Row>
                    <Grid.Column
                      as="h1"
                      textAlign="center"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#00a651',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      Up + Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={upDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        type="U"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>

                    <Grid.Column
                      as="h1"
                      textAlign="center"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#afafaf',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                    >
                      Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={false}
                        addFlightInstruction={this.addFlightInstruction}
                        type="C"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                    <Grid.Column
                      as="h1"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#00aeef',
                        borderStyle: 'solid',
                        borderColor: '#484848',
                      }}
                      textAlign="center"
                    >
                      Down + Strafe
                      <ButtonPanel
                        latestInstructionMessage={latestInstructionMessage}
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={downDisabled}
                        addFlightInstruction={this.addFlightInstruction}
                        type="D"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} padded>
                  <Grid.Column textAlign="center">
                    <Button onClick={() => this.addRotationInstruction('ccw')}>
                      <Button.Content visible>
                        <Icon name="undo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button onClick={() => this.addRotationInstruction('cw')}>
                      <Button.Content visible>
                        <Icon name="redo" />
                        90&deg;
                      </Button.Content>
                    </Button>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} padded>
                  <Grid.Column textAlign="center">
                    <Link to={'/'}>
                      <Button onClick={() => this.props.changeTab('run')}>
                        Build Flight Path!
                      </Button>
                    </Link>
                  </Grid.Column>

                  <Grid.Column>
                    {this.props.obstacles ? (
                      <Button onClick={this.props.toggleObstacles}>
                        Remove Obstacles
                      </Button>
                    ) : (
                      <Button onClick={this.props.toggleObstacles}>
                        Insert Obstacles
                      </Button>
                    )}
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid.Column>

            <Grid.Column width={3}>
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
    speed: state.speed,
    scale: state.scale,
    flightInstructions: state.flightInstructions,
    droneOrientation: state.droneOrientation,
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    droneConnectionStatus: state.droneConnectionStatus,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    clearInstructions: () => dispatch(clearInstructions()),
    updateCDP: newPosition => {
      dispatch(updateCDP(newPosition));
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
      addObjectToScene: selectedObj => {
        dispatch(addObjectToScene(selectedObj));
      }
  };
};

export default connect(
  mapState,
  mapDispatch
)(SceneBuilder);
