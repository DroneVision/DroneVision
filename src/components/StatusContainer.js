import React, { Component } from "react";
import Battery from "./Battery";
import { connect } from "react-redux";
import { List, Segment } from "semantic-ui-react";

class StatusSegment extends Component {
  render() {
    const { battery, speed } = this.props;
    return (
      <div id="status_segment">
        <Segment compact tertiary padded floated="right">
          <List divided relaxed>
            <List.Item>
              <List.Content>
                <Battery percent={battery} />
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
    battery: state.battery,
    state: state.speed
  };
};

export default connect(mapState)(StatusSegment);
