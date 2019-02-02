import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { changeTab } from '../store/store';

class Navbar extends Component {
  handleTabChange = (e, { name }) => this.props.changeTab(name);

  render() {
    const { activeTab } = this.props;
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
          </Menu>
        </Segment>
      </div>
    );
  }
}

const mapState = state => {
  return { activeTab: state.navTab };
};

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(Navbar);
