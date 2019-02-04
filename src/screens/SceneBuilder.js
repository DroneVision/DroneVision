import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import {
  Button,
  Icon,
  List,
  Segment,
  Header,
  Grid,
  Image,
  ListContent,
  Input
} from 'semantic-ui-react';

import NumericInput from 'react-numeric-input';


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
  addObjectToScene,
  updateSceneObj
} from '../store/store';

const { ipcRenderer } = window.require('electron');


const defaultObj = {
  length: 2,
  width: 2,
  height: 2,
  position: {
    x: 0, y: 0, z: 0
  }
}

class SceneBuilder extends Component {
  constructor(props) {
    super(props);
    this.objId = 1;
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

  createCube = ({id, length, width, height, position }) => {
    const { x, y, z } = position;
    const objGeometry = new THREE.CubeGeometry(width, height, length);
    const objMaterial = new THREE.MeshPhongMaterial({
      color: 0x6666ff,
      flatShading: false,
    });
    // const obstacleEdges = new THREE.EdgesGeometry(objGeometry);
    // const obstacleLines = new THREE.LineSegments(
    //   obstacleEdges,
    //   new THREE.LineBasicMaterial({ color: 0x000000 })
    // );
    const obj = new THREE.Mesh(objGeometry, objMaterial);
    obj.position.set(x, y, z);

    const objId = id || this.objId++;
    obj.name = `${objId}`
    const newObj = {
      id: objId,
      name: `obj${objId}`,
      length,
      width,
      height,
      position,
      ref: obj
    }

    return newObj;
  }


  addAndCreateObj = () => {
    const newObj = this.createCube(defaultObj);
    this.props.canvasScene.add(newObj.ref);
    this.props.addObjectToScene(newObj);
  }

  handleObjChange = (valNum, valStr, inputElem) => {
    const sceneObj = this.props.sceneObjects.find(sceneObj => Number(inputElem.id) === sceneObj.id);
    // propertyName is length/width/height.
    const propertyName = inputElem.name; 
    sceneObj[propertyName] = valNum;
    // need to get reference to the object in order to remove it
    const objToRemove = this.props.canvasScene.getObjectByName(sceneObj.ref.name)
    this.props.canvasScene.remove(objToRemove);
    this.props.updateSceneObj(sceneObj);
    const newObj = this.createCube(sceneObj);
    this.props.canvasScene.add(newObj.ref);
  }

  render() {
    const { limits } = this.state;
    const { flightInstructions, distance, droneOrientation, sceneObjects } = this.props;

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
                <Button onClick={this.addAndCreateObj}>
                  <Button.Content visible>
                    <Icon name="plus" />
                    Create New Object
                  </Button.Content>
                </Button>
              </Grid.Row>


              <Grid.Row>
                <Segment inverted>
                  <List divided inverted animated>
                    <List.Header>
                      <i>Your objects</i>
                    </List.Header>
                    {sceneObjects
                      .sort((a, b) => a.id - b.id).map(sceneObj => {
                        return (
                          <List.Item
                            className="flight-message-single"
                            key={sceneObj.id}
                          >
                            <List.Content>
                              Name: {sceneObj.name}
                            </List.Content>
                            <ListContent>
                              {`Width:   `}
                              <NumericInput
                                id={sceneObj.id}
                                name={'width'}
                                size={3}
                                min={1}
                                max={this.props.scale}
                                value={sceneObj.width}
                                onChange={this.handleObjChange}
                              />
                              {`   m.`}
                            </ListContent>
                            <ListContent>
                              {`Length:   `}
                              <NumericInput
                                id={sceneObj.id}
                                name={'length'}
                                size={3}
                                min={1}
                                max={this.props.scale}
                                value={sceneObj.length}
                                onChange={this.handleObjChange}
                              />
                              {`   m.`}
                            </ListContent>
                            <ListContent>
                            {`Height:   `}
                              <NumericInput
                                id={sceneObj.id}
                                name={'height'}
                                size={3}
                                min={1}
                                max={this.props.scale}
                                value={sceneObj.height}
                                onChange={this.handleObjChange}
                              />
                              {`   m.`}
                            </ListContent>
                          </List.Item>
                        );
                      })}
                  </List>
                </Segment>
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
    canvasScene: state.canvasScene,
    sceneObjects: state.sceneObjects
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
    },
    updateSceneObj: updatedObj => dispatch(updateSceneObj(updatedObj))
  };
};

export default connect(
  mapState,
  mapDispatch
)(SceneBuilder);
