import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Icon, Button, Image } from 'semantic-ui-react';
import FlyControls from '../components/FlyControls';
import Stream from '../components/Stream';
import DroneTelemetry from '../components/DroneTelemetry';
const { ipcRenderer } = window.require('electron');

class FlyScreen extends Component {
  realTimeFly = instruction => {
    console.log('sending single instruction to drone', instruction);
    ipcRenderer.sendSync('single-instruction', instruction);
  };

  realTimeTakeOff = () => {
    console.log('sending single instruction to drone', 'takeoff');
    ipcRenderer.sendSync('takeoff');
  };

  render() {
    return (
      <div id="fly">
        <Grid padded centered>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="plane" />
                <Header.Content>
                  Manual Control
                  <Header.Subheader>
                    <i>Fly your drone in real-time</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="cloudscale" />
                <Header.Content>
                  Drone Telemetry
                  <Header.Subheader>
                    <i>Real-Time UAV Telemetry</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={2}>
            <Grid.Column id="centered">
              {/* <Stream /> */}
              <Image
                className="manual-control-logo"
                src={require('../assets/iconset/icons.iconset/icon_DroneVision-Icon512.png')}
              />
            </Grid.Column>
            <Grid.Column id="centered">
              <DroneTelemetry />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <FlyControls
              distance={this.props.distance}
              speed={this.props.speed}
            />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = state => {
  return {
    distance: state.distance,
    speed: state.speed,
  };
};

// const mapDispatch = dispatch => {
//   return {
//     increaseDistance: () => {
//       dispatch(incsldknreaseDistance());
//     },
//     decreaseDistance: () => {
//       dispatch(decreaseDistance());
//     },
//     increaseSpeed: () => {
//       dispatch(increaseSpeed());
//     },
//     decreaseSpeed: () => {
//       dispatch(decreaseSpeed());
//     },
//   };
// };

export default connect(
  mapState,
  null
)(FlyScreen);
