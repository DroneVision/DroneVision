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
      <Container>
        <Header
          as="h1"
          content="Welcome to DroneVision"
          inverted
          style={{
            fontSize: '6em',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '3em',
          }}
        />
        <Header
          as="h2"
          content="Prepare for takeoff!"
          inverted
          style={{
            fontSize: '1.7em',
            fontWeight: 'normal',
            marginTop: '1.5em',
          }}
        />
        <Grid columns={2} centered>
          <Grid.Row>
            <Grid.Column width={4}>
              <Link to={'/scene-builder'}>
                <Button
                  primary
                  size="huge"
                  onClick={() => this.props.changeTab('scene-builder')}
                >
                  Create a Scene
                  <Icon name="right arrow" />
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column width={4}>
              <Link to={'/path-builder'}>
                <Button
                  primary
                  size="huge"
                  onClick={() => this.props.changeTab('path-builder')}
                >
                  Create a Flight-Path
                  <Icon name="right arrow" />
                </Button>
              </Link>
              /
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <Link to={'/scene-builder'}>
                <Button
                  secondary
                  size="huge"
                  onClick={this.handleLoadSceneObjects}
                >
                  Import a Scene
                  <Icon name="right arrow" />
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column width={4}>
              <Link to={'/path-builder'}>
                <Button
                  secondary
                  size="huge"
                  onClick={this.handleLoadFlightInstructions}
                >
                  Import a Flight-Path
                  <Icon name="right arrow" />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      // <Link to={'/autopilot'}>
      //   <Button onClick={() => this.props.changeTab('autopilot')}>
      //     Run Autopilot/Record Video
      //   </Button>
      // </Link>
      // <Grid columns={3} centered>
      //   <Grid.Row>
      //     <Grid.Column width={3}>
      //       <Image src={require('../assets/images/scene.png')} />
      //     </Grid.Column>
      //     <Grid.Column width={3}>
      //       <Image src={require('../assets/images/path.png')} />
      //     </Grid.Column>
      //   </Grid.Row>

      //   <Grid.Row>
      //     <Grid.Column width={3}>
      //       <Image src={require('../assets/images/autopilot.png')} />
      //     </Grid.Column>
      //     <Grid.Column width={3}>
      //       <Image src={require('../assets/images/manual.png')} />
      //     </Grid.Column>
      //     <Grid.Column width={4}>
      //       <Image src={require('../assets/images/video.png')} />
      //     </Grid.Column>
      //   </Grid.Row>
      // </Grid>
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
