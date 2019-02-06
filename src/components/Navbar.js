import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { changeTab, updateInstructions,loadSceneObjsFromFile } from '../store/store';
import { saveFile, loadFile } from '../utils/fileSystemUtils';

class Navbar extends Component {
  handleTabChange = (e, { name }) => this.props.changeTab(name);

  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFile('flight-instructions');
    this.props.updateInstructions(flightInstructions);
  };
  handleLoadSceneObjects = async () => {
    const sceneObjects = await loadFile('scene-objects');
    this.props.loadSceneObjsFromFile(sceneObjects);
  };

  render() {
    const { activeTab, flightInstructions, sceneObjects } = this.props;

    return (
      <div id="navbar">
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item
              as={Link}
              to={'/scene-builder'}
              name="scene-builder"
              active={activeTab === 'scene-builder'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/path-builder'}
              name="path-builder"
              active={activeTab === 'path-builder'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/autopilot'}
              name="autopilot"
              active={activeTab === 'autopilot'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/manual-flight'}
              name="manual-flight"
              active={activeTab === 'manual-flight'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/my-videos'}
              name="my-videos"
              active={activeTab === 'my-videos'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/about'}
              name="about"
              active={activeTab === 'about'}
              onClick={this.handleTabChange}
            />
            <Menu.Menu position="right">
              <Dropdown text="Import/Export" pointing className="link item">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleLoadFlightInstructions}>
                    Import Flight Path
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      saveFile('flight-instructions', flightInstructions)
                    }
                  >
                    Export Flight Path
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleLoadSceneObjects}>
                    Import Scene Objects
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      saveFile('scene-objects', sceneObjects)
                    }
                  >
                    Export Scene Objects
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
        </Segment>
      </div>
    );
  }
}

const mapState = state => {
  return {
    activeTab: state.navTab,
    flightInstructions: state.flightInstructions,
    sceneObjects: state.sceneObjects,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
      dispatch(updateInstructions(flightInstructions)),
      loadSceneObjsFromFile: sceneObjects => dispatch(loadSceneObjsFromFile(sceneObjects))
  };
};

export default connect(
  mapState,
  mapDispatch
)(Navbar);
