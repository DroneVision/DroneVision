import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { changeTab, updateInstructions } from '../store/store';
import {
  saveFlightInstructions,
  loadFlightInstructions,
} from '../utils/fileSystemUtils';
import { drawPath, getDroneCoords } from '../utils/drawPathUtils';

const { ipcRenderer } = window.require('electron');

class Navbar extends Component {
  handleTabChange = (e, { name }) => this.props.changeTab(name);

  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFlightInstructions();
    this.props.updateInstructions(flightInstructions);
    drawPath(this.props.flightInstructions, this.props.distance);
  };

  componentDidMount() {
    ipcRenderer.on('file-opened', (event, flightInstructions) => {
      this.props.updateInstructions(flightInstructions);
      drawPath(flightInstructions, this.props.distance);
    });
  }

  render() {
    const { activeTab} = this.props;
    const { flightInstructions, distance, droneOrientation } = this.props;
    const flightCoords = getDroneCoords(flightInstructions, distance);
    return (
      <div id="navbar">
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item
              as={Link}
              to={'/build'}
              name="build"
              active={activeTab === 'build'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/run'}
              name="run"
              active={activeTab === 'run'}
              onClick={this.handleTabChange}
            />
            <Menu.Item
              as={Link}
              to={'/fly'}
              name="fly"
              active={activeTab === 'fly'}
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
                      saveFlightInstructions(this.props.flightInstructions)
                    }
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
