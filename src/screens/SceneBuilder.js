import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  Button,
  Icon,
  List,
  Segment,
  Header,
  Image,
  Grid,
  ListContent,
  Modal,
} from 'semantic-ui-react';

import NumericInput from 'react-numeric-input';

import { getDrawInstruction } from '../utils/buttonPanelUtils';

import ButtonPanel from '../components/ButtonPanel';
import SceneCanvas from '../components/SceneCanvas';
import {
  changeTab,
  toggleObstacles,
  addSceneObj,
  updateSceneObj,
  updateSelectedObj,
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
  visible: true,
};

let objIdGlobal = 1;
class SceneBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startingPoint: { x: 0, y: 1, z: 0 },
      limits: {},
      helpOpen: false,
    };
  }

  componentDidMount() {
    // Listen for flight import from main process
    // ipcRenderer.on('file-opened', (event, flightInstructions) => {
    //   this.props.updateInstructions(flightInstructions);
    // });
    if (this.props.sceneObjects.length) {
      const limits = this.getNewLimits(this.props.sceneObjects[0]);
      this.setState({ selectedObj: this.props.sceneObjects[0], limits });
    }
  }

  createNewObj = () => {
    const { addSceneObj, updateSelectedObj } = this.props;
    const id = objIdGlobal++;
    const newObj = {
      length: 2,
      width: 2,
      height: 2,
      position: {
        x: 0,
        y: -4, //accounts for plane shifting + height/2
        z: 0,
      },
      visible: true,
    };

    newObj.id = id;
    newObj.name = `Object ${id}`;
    updateSelectedObj(newObj.id);
    addSceneObj(newObj);
    const limits = this.getNewLimits(newObj);
    this.setState({ selectedObj: newObj, limits, activeListItemId: newObj.id });
    this.updateScroll();
    this.setState({ limits });
  };

  handleObjDimChange = (valNum, valStr, inputElem) => {
    const { sceneObjects, updateSceneObj, updateSelectedObj } = this.props;
    const objToUpdate = sceneObjects.find(
      sceneObj => Number(inputElem.id) === sceneObj.id
    );
    // propertyName is length/width/height
    const propertyName = inputElem.name;
    objToUpdate[propertyName] = valNum;
    updateSelectedObj(objToUpdate.id);
    updateSceneObj(objToUpdate);
    const limits = this.getNewLimits(objToUpdate);
    this.setState({ limits });
  };

  handleButtonClick = dirString => {
    const { selectedObjId, sceneObjects, updateSceneObj } = this.props;

    const drawInstruction = getDrawInstruction(dirString);

    const objToUpdate = sceneObjects.find(obj => obj.id === selectedObjId);

    const [z, x, y] = drawInstruction;
    objToUpdate.position.x += x;
    objToUpdate.position.y += y;
    objToUpdate.position.z += z;

    updateSceneObj(objToUpdate);
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

  deleteObject = event => {
    console.log('deleted', event.target);
  };

  handleObjectSelection = evt => {
    const { sceneObjects, updateSelectedObj } = this.props;
    const selectedObj = sceneObjects.find(
      sceneObj => sceneObj.id === Number(evt.currentTarget.id)
    );
    updateSelectedObj(selectedObj.id);
    const limits = this.getNewLimits(selectedObj);
    this.setState({ limits });
  };

  updateScroll = () => {
    const instructions = document.getElementById('object-list');
    instructions.scrollTop = instructions.scrollHeight;
  };

  buildHelp = () => this.setState({ helpOpen: true });
  handleClose = () => this.setState({ helpOpen: false });

  render() {
    const { limits } = this.state;
    const { droneOrientation, sceneObjects, selectedObjId } = this.props;
    const selectedObj = sceneObjects.find(obj => obj.id === selectedObjId);
    let leftDisabled,
      rightDisabled,
      forwardDisabled,
      reverseDisabled,
      upDisabled,
      downDisabled;
    if (selectedObj) {
      leftDisabled = selectedObj.position.x >= limits.maxX;
      rightDisabled = selectedObj.position.x <= limits.minX;
      forwardDisabled = selectedObj.position.z >= limits.maxZ;
      reverseDisabled = selectedObj.position.z <= limits.minZ;
      upDisabled = selectedObj.position.y >= limits.maxY;
      downDisabled = selectedObj.position.y <= limits.minY;
    }
    return (
      <div id="scene-builder">
        <div id="scene-help">
          {/* <Image
            src={require('../assets/images/helper-images/build-instructions.png')}
            size="medium"
          /> */}
          <Segment inverted id="object-list">
            <List divided inverted selection>
              <List.Header className="object-header">YOUR OBJECTS:</List.Header>
              {sceneObjects
                .sort((a, b) => a.id - b.id)
                .map(sceneObj => {
                  return (
                    <List.Item
                      className="object-single"
                      active={this.state.activeListItemId === sceneObj.id}
                      key={sceneObj.id}
                      onClick={this.handleObjectSelection}
                      id={sceneObj.id}
                    >
                      {/* BEGIN remove button */}
                      <div
                        className="object-removal-button"
                        onClick={() => {
                          this.deleteObject();
                        }}
                      >
                        +
                      </div>
                      {/* END remove button */}
                      <List.Content className="object-name">
                        {sceneObj.name}
                      </List.Content>
                      <ListContent>
                        {`Length:   `}
                        <NumericInput
                          className="numeric-input"
                          id={sceneObj.id}
                          name={'length'}
                          size={3}
                          min={1}
                          max={this.props.scale}
                          value={sceneObj.length}
                          onChange={this.handleObjDimChange}
                        />
                        {`   m`}
                      </ListContent>
                      <ListContent>
                        {`Width:   `}
                        <NumericInput
                          className="numeric-input"
                          id={sceneObj.id}
                          name={'width'}
                          size={3}
                          min={1}
                          max={this.props.scale}
                          value={sceneObj.width}
                          onChange={this.handleObjDimChange}
                        />
                        {`   m`}
                      </ListContent>
                      <ListContent>
                        {`Height:   `}
                        <NumericInput
                          className="numeric-input"
                          id={sceneObj.id}
                          name={'height'}
                          size={3}
                          min={1}
                          max={this.props.scale}
                          value={sceneObj.height}
                          onChange={this.handleObjDimChange}
                        />
                        {`   m`}
                      </ListContent>
                    </List.Item>
                  );
                })}
            </List>
          </Segment>
          <Button color="facebook" onClick={this.createNewObj}>
            <Button.Content visible>
              <Icon name="plus" />
              Create New Object
            </Button.Content>
          </Button>
        </div>
        <div className="row">
          <div className="row-item">
            <Header as="h1" dividing className="centered-padded-top">
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
        <div className="row">
          <div className="row-item">
            {/* Conditionally Render Button Panels */}

            {sceneObjects.length ? (
              <div id="row">
                <div id="button-panels">
                  <table>
                    <thead align="center">
                      <tr>
                        <td>
                          <h1>Up & Strafe</h1>
                        </td>
                        <td>
                          <h1>Strafe</h1>
                        </td>
                        <td>
                          <h1>Down & Strafe</h1>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td id="up-strafe">
                          <ButtonPanel
                            leftDisabled={leftDisabled}
                            rightDisabled={rightDisabled}
                            forwardDisabled={forwardDisabled}
                            reverseDisabled={reverseDisabled}
                            allDisabled={
                              upDisabled || this.state.preVisButtonsDisabled
                            }
                            clickHandler={this.handleButtonClick}
                            type="U"
                            droneOrientation={droneOrientation}
                          />
                        </td>
                        <td id="strafe">
                          <ButtonPanel
                            leftDisabled={leftDisabled}
                            rightDisabled={rightDisabled}
                            forwardDisabled={forwardDisabled}
                            reverseDisabled={reverseDisabled}
                            allDisabled={this.state.preVisButtonsDisabled}
                            clickHandler={this.handleButtonClick}
                            type="C"
                            droneOrientation={droneOrientation}
                          />
                        </td>
                        <td id="down-strafe">
                          <ButtonPanel
                            leftDisabled={leftDisabled}
                            rightDisabled={rightDisabled}
                            forwardDisabled={forwardDisabled}
                            reverseDisabled={reverseDisabled}
                            allDisabled={
                              downDisabled || this.state.preVisButtonsDisabled
                            }
                            clickHandler={this.handleButtonClick}
                            type="D"
                            droneOrientation={droneOrientation}
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
            ) : null}

            {/* {sceneObjects.length ? (
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
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={upDisabled}
                        clickHandler={this.handleButtonClick}
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
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={false}
                        clickHandler={this.handleButtonClick}
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
                        leftDisabled={leftDisabled}
                        rightDisabled={rightDisabled}
                        forwardDisabled={forwardDisabled}
                        reverseDisabled={reverseDisabled}
                        allDisabled={downDisabled}
                        clickHandler={this.handleButtonClick}
                        type="D"
                        droneOrientation={droneOrientation}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Row>
            ) : null} */}

            {/* Popup Help Icon */}
            {/* {sceneObjects.length ? (
              <div id="build-help">
                <Icon
                  name="question circle"
                  size="large"
                  onClick={this.buildHelp}
                />
              </div>
            ) : null} */}

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
    sceneObjects: state.sceneObjects,
    selectedObjId: state.selectedObjId,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    toggleObstacles: () => {
      dispatch(toggleObstacles());
    },
    addSceneObj: newObj => {
      dispatch(addSceneObj(newObj));
    },
    updateSceneObj: updatedObj => dispatch(updateSceneObj(updatedObj)),
    updateSelectedObj: objId => dispatch(updateSelectedObj(objId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(SceneBuilder);
