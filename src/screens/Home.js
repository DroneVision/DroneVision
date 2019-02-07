import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { changeTab } from '../store';
class Home extends Component {
  render() {
    return (
      <Link to={'/autopilot'}>
        <Button onClick={() => this.props.changeTab('autopilot')}>
          Run Autopilot/Record Video
        </Button>
      </Link>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
  };
};

export default connect(
  null,
  mapDispatch
)(withRouter(Home));
