import React, { Component } from 'react';

class Video extends Component {
  render() {
    return (
      <div id="video-player">
        {/* <video autoplay loop controls src={require(`../videos/${this.props.video}.mp4`)} /> */}
      </div>
    );
  }
}

export default Video;
