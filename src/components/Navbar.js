import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { changeTab, updateInstructions } from '../store/store';
import {
  saveFlightInstructions,
  loadFlightInstructions,
} from '../utils/fileSystemUtils';


const { ipcRenderer } = window.require('electron');

class Navbar extends Component {
  handleTabChange = (e, { name }) => this.props.changeTab(name);

  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFlightInstructions();
    this.props.updateInstructions(flightInstructions);
    
  };

  componentDidMount() {
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
      
    });
  }

  render() {
    const { activeTab } = this.props;
    const { flightInstructions } = this.props;

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
              name="videos"
              active={activeTab === 'videos'}
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
                    onClick={() => saveFlightInstructions(flightInstructions)}
                  >
                    Export Flight Path
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
    distance: state.distance,
  };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
      dispatch(updateInstructions(flightInstructions)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Navbar);
