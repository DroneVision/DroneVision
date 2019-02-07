import React, { Component } from 'react';
import Battery from './Battery';
import { connect } from 'react-redux';
import { List, Segment, Icon } from 'semantic-ui-react';
import { changeRoll, changePitch, changeYaw } from '../store';
const { ipcRenderer } = window.require('electron');

let interval;

class StatusContainer extends Component {
  constructor() {
    super();
    this.state = {
      battery: 0,
      pitch: 'no data',
      roll: 'no data',
      yaw: 'no data',
      temph: 'no data',
      time: 'no data',
    };
  }

  async componentDidMount() {
    interval = setInterval(async () => {
      await this.getDroneState();
    }, 100);
    ipcRenderer.on('updatedDroneState', (event, arg) => {
      if (arg) {
        this.setState({
          battery: arg.bat,
          pitch: arg.pitch,
          roll: arg.roll,
          yaw: arg.yaw,
          temph: arg.temph,
          time: arg.time,
        });

        this.props.changeRoll(arg.roll);
        this.props.changePitch(arg.pitch);
        this.props.changeYaw(arg.yaw);
      }
    });
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getDroneState = () => {
    ipcRenderer.send('getDroneState');
  };

  resetDroneState = () => {
    ipcRenderer.on('drone-connection', (event, droneConnectionStatus) => {
      this.props.updateDroneConnectionStatus(droneConnectionStatus);
      if (!droneConnectionStatus.isConnected) {
        this.setState({
          battery: 0,
          pitch: 'no data',
          roll: 'no data',
          yaw: 'no data',
          temph: 'no data',
          time: 'no data',
        });
      }
    });
  };

  render() {
    return (
      <div id="status-segment">
        <Segment>
          <List divided relaxed="very" vertical="true">
            <List.Item>
              <List.Content>
                Connection Status:{' '}
                {this.props.droneConnectionStatus.isConnected ? (
                  <Icon name="circle" color="green" />
                ) : (
                  <Icon name="circle" color="red" />
                )}
              </List.Content>

              {this.props.droneConnectionStatus.isConnected ? (
                <List.Content>
                  Connected to: {this.props.droneConnectionStatus.droneName}
                </List.Content>
              ) : null}
            </List.Item>

            {/* Battery */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content verticalAlign="bottom">
                  <Battery percent={this.state.battery} />
                </List.Content>
              </List.Item>
            ) : null}

            {/* Flight Time */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content>Flight Time: {this.state.time}</List.Content>
              </List.Item>
            ) : null}

            {/* Temp */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content>Temp: {this.state.temph}</List.Content>
              </List.Item>
            ) : null}

            {/* Roll */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content>Roll: {this.state.roll}</List.Content>
              </List.Item>
            ) : null}

            {/* Pitch */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content>Pitch: {this.state.pitch}</List.Content>
              </List.Item>
            ) : null}

            {/* Yaw */}
            {this.props.droneConnectionStatus.isConnected ? (
              <List.Item>
                <List.Content>Yaw: {this.state.yaw}</List.Content>
              </List.Item>
            ) : null}
          </List>
        </Segment>
      </div>
    );
  }
}

const mapState = state => {
  return {
    speed: state.speed,
    droneConnectionStatus: state.droneConnectionStatus,
  };
};

const mapDispatch = dispatch => {
  return {
    changeRoll: newRoll => {
      dispatch(changeRoll(newRoll));
    },
    changePitch: newPitch => {
      dispatch(changePitch(newPitch));
    },
    changeYaw: newYaw => {
      dispatch(changeYaw(newYaw));
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(StatusContainer);
