import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  state = { activeItem: 'build' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item
            as={Link}
            to={'/build'}
            name="build"
            active={activeItem === 'build'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            to={'/run'}
            name="run"
            active={activeItem === 'run'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            to={'/fly'}
            name="fly"
            active={activeItem === 'run'}
            onClick={this.handleItemClick}
          />
        </Menu>
      </Segment>
    );
  }
}

export default Navbar;
