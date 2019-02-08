import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PathBuilder from './screens/PathBuilder';
import SceneBuilder from './screens/SceneBuilder';
import Home from './screens/Home';
import AutoPilot from './screens/AutoPilot';
import Videos from './screens/Videos';
import About from './screens/About';
import ManualControl from './screens/ManualControl';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  updateInstructions,
  updateDroneConnectionStatus,
  updateSceneObjs,
  updateSelectedObj,
} from './store';
const { ipcRenderer } = window.require('electron');

class Routes extends Component {
  componentDidMount() {
    // Listen for flight-instructions import from main process
    ipcRenderer.on('load-flight-instructions', (event, data) => {
      this.props.updateInstructions(data['flight-instructions']);
    });

    ipcRenderer.on('load-scene-objects', (event, data) => {
      this.props.updateSceneObjs(data['scene-objects']);
      this.props.updateSelectedObj(data['sceneObjects'][0].id);
    });

    ipcRenderer.on('load-both', (event, data) => {
      console.log('d', data);
      this.props.updateInstructions(data['flight-instructions']);
      this.props.updateSceneObjs(data['scene-objects']);
      this.props.updateSelectedObj(data['scene-objects'][0].id);
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

    // ipcRenderer.on('drone-connection', (event, droneConnectionStatus) => {
    //   // Send a command to drone
    //   ipcRenderer.send('single-instruction', 'command');
    //   this.props.updateDroneConnectionStatus(droneConnectionStatus);
    //   console.log('invoked');
    // });
  }
  render() {
    return (
      <div id="body">
        <div id="left-column" />
        <div id="right-column" />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/scene-builder" component={SceneBuilder} />
          <Route path="/path-builder" component={PathBuilder} />
          <Route path="/autopilot" component={AutoPilot} />
          <Route path="/manual-flight" component={ManualControl} />
          <Route path="/videos" component={Videos} />
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
    updateInstructions: updatedFlightInstructions =>
      dispatch(updateInstructions(updatedFlightInstructions)),
    updateSceneObjs: sceneObjects => dispatch(updateSceneObjs(sceneObjects)),
    updateSelectedObj: selectedObjId =>
      dispatch(updateSelectedObj(selectedObjId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(Routes));
