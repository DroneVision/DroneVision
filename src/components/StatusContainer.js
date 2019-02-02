import React, { Component } from 'react';
import Battery from './Battery';
import { connect } from 'react-redux';
import { List, Segment } from 'semantic-ui-react';
import { changeRoll, changePitch, changeYaw } from '../store/store';
const { ipcRenderer } = window.require('electron');

let interval;

class StatusSegment extends Component {
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
    // console.log('this.state: ', this.state);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getDroneState = () => {
    ipcRenderer.send('getDroneState');
    ipcRenderer.on('updatedDroneState', (event, arg) => {
      // console.log('arg: ', arg);
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
    // ipcRenderer.send('getDroneState');
    // console.log('getDroneState from StatusContainer invoked');
    // ipcRenderer.on('returnedState', (event, arg) => {
    //   console.log('getReturnedState: ', arg);
    // })
  };

  render() {
    return (
      <div id="status-segment">
        <Segment>
          <List>
            <List.Item>
              <List.Content>Connection Status: {this.props.droneConnectionStatus.isConnected ? 'Connected': 'Not Connected'}</List.Content>
              <List.Content>Connected to: {this.props.droneConnectionStatus.droneName}</List.Content>
            </List.Item>
          </List>
          <List divided relaxed="very" horizontal>
            <List.Item>
              <List.Content verticalAlign="bottom">
                <Battery percent={this.state.battery} />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Flight Time: {this.state.time}</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Temp: {this.state.temph}</List.Content>
            </List.Item>
            <List.Item />
            <List.Item>
              <List.Content>Pitch: {this.state.pitch}</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Roll: {this.state.roll}</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Yaw: {this.state.yaw}</List.Content>
            </List.Item>
          </List>
        </Segment>
      </div>
    );
  }
}

const mapState = state => {
  return {
    speed: state.speed,
    droneConnectionStatus: state.droneConnectionStatus
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
)(StatusSegment);
