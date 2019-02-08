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
import { changeTab } from '../store';
class Home extends Component {
  render() {
    return (
      <Container text>
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
        <Link to={'/scene-builder'}>
          <Button
            primary
            size="huge"
            onClick={() => this.props.changeTab('scene-builder')}
          >
            Create a scene
            <Icon name="right arrow" />
          </Button>
        </Link>
        <Link to={'/path-builder'}>
          <Button
            primary
            size="huge"
            onClick={() => this.props.changeTab('path-builder')}
          >
            Create an autopilot flight path
            <Icon name="right arrow" />
          </Button>
        </Link>
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
  };
};

export default connect(
  null,
  mapDispatch
)(withRouter(Home));
