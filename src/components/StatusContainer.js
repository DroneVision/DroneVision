import React, { Component } from 'react';
import Battery from './Battery';
import { connect } from 'react-redux';
import { List, Segment } from 'semantic-ui-react';
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
      this.getDroneState();
    }, 50);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getDroneState = () => {
    ipcRenderer.send('getDroneState');
    ipcRenderer.on('updatedDroneState', (event, arg) => {
      console.log('arg: ', arg);
      if (arg) {
        this.setState({
          battery: arg.bat,
          pitch: arg.pitch,
          roll: arg.roll,
          yaw: arg.yaw,
          temph: arg.temph,
          time: arg.time,
        });
      }
    });
  };

  render() {
    const { speed } = this.props;
    return (
      <div id="status-segment">
        <Segment compact tertiary padded floated="right">
          <List divided relaxed>
            <List.Item>
              <List.Content>
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
    state: state.speed,
  };
};

// const mapDispatch = dispatch => {
//   return {
//     functionName: () => {
//       dispatch(functionName());
//     },
//   };
// };

export default connect(
  mapState,
  null
)(StatusSegment);
