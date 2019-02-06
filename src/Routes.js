import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Build from './screens/Build';
import SceneBuilder from './screens/SceneBuilder';
import Run from './screens/Run';
import Videos from './screens/Videos';
import About from './screens/About';
import FlyScreen from './screens/FlyScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  updateInstructions,
  updateDroneConnectionStatus,
  loadSceneObjsFromFile,
} from './store/store';
const { ipcRenderer } = window.require('electron');

class Routes extends Component {
  componentDidMount() {
    // Listen for flight-instructions import from main process
    ipcRenderer.on('load-flight-instructions', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
    });

    ipcRenderer.on('load-scene-objects', (event, sceneObjects) => {
      this.props.loadSceneObjsFromFile(sceneObjects);
    });
    // Listen for request for flight instructions save from main process
    ipcRenderer.on('save-flight-instructions', event => {
      // Reply back with instructions
      ipcRenderer.send(
        'send-flight-instructions',
        this.props.flightInstructions
      );
    });
    ipcRenderer.on('save-scene-objects', event => {
      // Reply back with instructions
      ipcRenderer.send('send-scene-objects', this.props.sceneObjects);
    });

    ipcRenderer.on('drone-connection', (event, droneConnectionStatus) => {
      this.props.updateDroneConnectionStatus(droneConnectionStatus);
      // Send a command to drone
      ipcRenderer.send('single-instruction', 'command');
    });
  }
  render() {
    return (
      <div id="body">
        <div id="left-column" />
        <div id="right-column" />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Build} />
          <Route path="/scene-builder" component={SceneBuilder} />
          <Route path="/path-builder" component={Build} />
          <Route path="/autopilot" component={Run} />
          <Route path="/manual-flight" component={FlyScreen} />
          <Route path="/my-videos" component={Videos} />
          <Route path="/about" component={About} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapState = state => {
  return {
    flightInstructions: state.flightInstructions,
    sceneObjects: state.sceneObjects,
  };
};

const mapDispatch = dispatch => {
  return {
    updateDroneConnectionStatus: droneStatus =>
      dispatch(updateDroneConnectionStatus(droneStatus)),
    updateInstructions: updatedFlightInstructions =>
      dispatch(updateInstructions(updatedFlightInstructions)),
    loadSceneObjsFromFile: sceneObjects =>
      dispatch(loadSceneObjsFromFile(sceneObjects)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(Routes));
