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
} from 'semantic-ui-react';

import NumericInput from 'react-numeric-input';

import { getDrawInstruction } from '../utils/buttonPanelUtils';

import ButtonPanel from '../components/ButtonPanel';
import SceneCanvas from '../components/SceneCanvas';
import {
  changeTab,
  toggleObstacles,
  addObjectToScene,
  updateSceneObj,
} from '../store/store';

const { ipcRenderer } = window.require('electron');

const defaultObj = {
  length: 2,
  width: 2,
  height: 2,
  position: {
    x: 0,
    y: -4, //accounts for plane shifting + height/2
    z: 0,
  },
};

class SceneBuilder extends Component {
  constructor(props) {
    super(props);
    this.objId = 1;
    this.state = {
      startingPoint: { x: 0, y: 1, z: 0 },
      selectedObj: {},
      activeListItemId: null,
    };
  }

  componentDidMount() {
    // Listen for flight import from main process
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
    });
  }

  createCube = ({ id, length, width, height, position }) => {
    const { x, y, z } = position;
    const objGeometry = new THREE.CubeGeometry(width, height, length);
    const objMaterial = new THREE.MeshPhongMaterial({
      color: 0x6666ff,
      flatShading: false,
    });
    const objEdges = new THREE.EdgesGeometry(objGeometry);
    const objLines = new THREE.LineSegments(
      objEdges,
      new THREE.LineBasicMaterial({ color: 0xccff00 })
    );
    const obj = new THREE.Mesh(objGeometry, objMaterial);
    obj.position.set(x, y, z);
    objLines.position.set(x, y, z);

    const objId = id || this.objId++;
    obj.name = `${objId}`;
    objLines.name = `${objId}-lines`;
    const newObj = {
      id: objId,
      name: `obj${objId}`,
      length,
      width,
      height,
      position,
      ref: obj,
      lineRef: objLines,
    };

    return newObj;
  };

  addAndCreateObj = () => {
    const { canvasScene, addObjectToScene } = this.props;
    const newObj = this.createCube(defaultObj);
    canvasScene.add(newObj.ref);
    canvasScene.add(newObj.lineRef);
    addObjectToScene(newObj);
    const previouslySelectedObj = this.state.selectedObj;
    if (previouslySelectedObj.id) {
      previouslySelectedObj.lineRef.material.color = new THREE.Color(0x000000);
    }

    const limits = this.getNewLimits(newObj);
    this.setState({ selectedObj: newObj, limits, activeListItemId: newObj.id });
  };

  handleObjDimChange = (valNum, valStr, inputElem) => {
    const { sceneObjects, canvasScene, updateSceneObj } = this.props;
    const sceneObj = sceneObjects.find(
      sceneObj => Number(inputElem.id) === sceneObj.id
    );
    // propertyName is length/width/height.
    const propertyName = inputElem.name;
    sceneObj[propertyName] = valNum;
    // need to get reference to the object in order to remove it
    const objToRemove = canvasScene.getObjectByName(sceneObj.ref.name);
    const lineToRemove = canvasScene.getObjectByName(sceneObj.lineRef.name);
    canvasScene.remove(objToRemove);
    canvasScene.remove(lineToRemove);

    const newObj = this.createCube(sceneObj);
    newObj.lineRef.material.color = new THREE.Color(0xccff00);
    const previouslySelectedObj = this.state.selectedObj;
    previouslySelectedObj.lineRef.material.color = new THREE.Color(0x000000);
    canvasScene.add(newObj.ref);
    canvasScene.add(newObj.lineRef);
    updateSceneObj(newObj);
    const limits = this.getNewLimits(newObj);
    this.setState({ selectedObj: newObj, activeListItemId: newObj.id, limits });
  };

  handleButtonClick = dirString => {
    const drawInstruction = getDrawInstruction(dirString);
    const selectedObj = this.state.selectedObj;
    const [z, x, y] = drawInstruction;
    selectedObj.ref.translateX(x);
    selectedObj.lineRef.translateX(x);
    selectedObj.ref.translateY(y);
    selectedObj.lineRef.translateY(y);
    selectedObj.ref.translateZ(z);
    selectedObj.lineRef.translateZ(z);

    const { x: newX, y: newY, z: newZ } = selectedObj.ref.position;
    const updatedObj = { ...selectedObj };
    updatedObj.position = { x: newX, y: newY, z: newZ };
    updatedObj.lineRef.material.color = new THREE.Color(0xccff00);
    this.setState({ selectedObj: updatedObj });
    this.props.updateSceneObj(updatedObj);
    this.setState({ selectedObj: updatedObj });
  };

  getNewLimits = selectedObj => {
    const { scale } = this.props;
    return {
      maxX: scale / 2 - selectedObj.width / 2,
      maxY: scale - 5 - selectedObj.height / 2,
      maxZ: scale / 2 - selectedObj.length / 2,
      minX: -scale / 2 + selectedObj.width / 2,
      minY: -5 + selectedObj.height / 2,
      minZ: -scale / 2 + selectedObj.length / 2,
    };
  };

  handleObjectSelection = evt => {
    const previouslySelectedObj = this.state.selectedObj;
    const selectedObj = this.props.sceneObjects.find(
      sceneObj => sceneObj.id === Number(evt.currentTarget.id)
    );
    if (previouslySelectedObj.id !== selectedObj.id) {
      previouslySelectedObj.lineRef.material.color = new THREE.Color(0x000000);
      selectedObj.lineRef.material.color = new THREE.Color(0xccff00);
      const limits = this.getNewLimits(selectedObj);
      this.setState({ selectedObj, limits, activeListItemId: selectedObj.id });
    }
  };

  render() {
    const { limits, selectedObj } = this.state;
    const { droneOrientation, sceneObjects } = this.props;
    let leftDisabled,
      rightDisabled,
      forwardDisabled,
      reverseDisabled,
      upDisabled,
      downDisabled;

    if (selectedObj.position) {
      leftDisabled = selectedObj.position.x >= limits.maxX;
      rightDisabled = selectedObj.position.x <= limits.minX;
      forwardDisabled = selectedObj.position.z >= limits.maxZ;
      reverseDisabled = selectedObj.position.z <= limits.minZ;
      upDisabled = selectedObj.position.y >= limits.maxY;
      downDisabled = selectedObj.position.y <= limits.minY;
    }
    return (
      <div id="scene-builder">
        <div className="row">
          <div id="scene-help">
            <Image
              src={require('../assets/images/helper-images/build-instructions.png')}
              size="medium"
            />
          </div>
          <div className="row-item">
            <Header as="h1" dividing id="centered-padded-top">
              <Icon name="building" />
              <Header.Content>
                Scene Builder
                <Header.Subheader>
                  <i>Add objects to your scene</i>
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </div>
        <div className="row">
          <div className="row-item">
            <SceneCanvas />
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  return {
    scale: state.scale,
    droneOrientation: state.droneOrientation,
    startingPosition: state.startingPosition,
    voxelSize: state.voxelSize,
    obstacles: state.obstacles,
    canvasScene: state.canvasScene,
    sceneObjects: state.sceneObjects,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    toggleObstacles: () => {
      dispatch(toggleObstacles());
    },
    addObjectToScene: selectedObj => {
      dispatch(addObjectToScene(selectedObj));
    },
    updateSceneObj: updatedObj => dispatch(updateSceneObj(updatedObj)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(SceneBuilder);
