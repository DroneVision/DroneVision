import React, { Component } from 'react';
import Battery from './Battery';
import { connect } from 'react-redux';
import { List, Segment } from 'semantic-ui-react';

class StatusSegment extends Component {
  render() {
    const { speed } = this.props;
    return (
      <div id="status-segment">
        <Segment compact tertiary padded floated="right">
          <List divided relaxed>
            <List.Item>
              <List.Content>
                <Battery percent={100} />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Speed: {speed}</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Height:</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Current Flight Time:</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Pitch:</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Roll:</List.Content>
            </List.Item>
            <List.Item>
              <List.Content>Yaw:</List.Content>
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
