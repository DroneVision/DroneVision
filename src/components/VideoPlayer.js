import React, { Component } from 'react';

class Video extends Component {
  render() {
    const {video} = this.props
    let url = null;
    if (video) {
      url = require(`../videos/${this.props.video}`)
      console.log(url)
    }
    return (
      <div id="video-player">
        <video loop controls src={url} />
      </div>
    );
  }
}

export default Video;
