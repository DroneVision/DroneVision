import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  Button,
  Image,
  Grid,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';
import { changeTab, updateInstructions, updateSceneObjs } from '../store';
import { loadFile } from '../utils/fileSystemUtils';
class Home extends Component {
  constructor(props) {
    super(props);
  }
  handleLoadFlightInstructions = async () => {
    const flightInstructions = await loadFile('flight-instructions');
    this.props.updateInstructions(flightInstructions);
    this.props.changeTab('path-builder');
  };
  handleLoadSceneObjects = async () => {
    const sceneObjects = await loadFile('scene-objects');
    this.props.updateSceneObjs(sceneObjects);
  };
  render() {
    return (
      <Container textAlign='center'>
        <Header
          as="h1"
          content="Welcome to DroneVision"
          style={{
            fontSize: '6em',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '3rem',
          }}
        />
        <Image
          centered
          src={require('../assets/images/home-tello.png')}
          size="large"
        />
        <div className="home-btn-row sm-mt">
            <Link to={'/scene-builder'}>
              <Button
                className="sm-mr"
                primary
                size="huge"
                onClick={() => this.props.changeTab('scene-builder')}
              >
                Create Scene
                <Icon name="right arrow" />
              </Button>
            </Link>
            <Link to={'/path-builder'}>
              <Button
                className="sm-ml"
                primary
                size="huge"
                onClick={() => this.props.changeTab('path-builder')}
              >
                Create Flight-Path
                <Icon name="right arrow" />
              </Button>
            </Link>
        </div>
          <Grid>
           <Grid.Row>
            <Grid.Column>
              <Link to={'/scene-builder'}>
                <Button
                  className="sm-mt"
                  secondary
                  size="huge"
                  onClick={this.handleLoadSceneObjects}
                >
                  Import Flight Path + Scene
                  <Icon className="sm-ml" name="cloud download" />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header
                as="h2"
                content="PREPARE FOR TAKEOFF"
                style={{
                  fontSize: '2.5em',
                  fontWeight: 'normal',
                  marginTop: '1.5em',
                  color: 'red'
                }}
              />
            </Grid.Column>
          </Grid.Row>
          
        </Grid>
      </Container>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    changeTab: tabName => dispatch(changeTab(tabName)),
    updateInstructions: flightInstructions =>
      dispatch(updateInstructions(flightInstructions)),
    updateSceneObjs: sceneObjects => dispatch(updateSceneObjs(sceneObjects)),
  };
};

export default connect(
  null,
  mapDispatch
)(withRouter(Home));
