import React from 'react';
import ReactPlayer from 'react-player';

const Video = props => {
  return (
    <div id="video-player">
      <ReactPlayer
        url="../../DroneVision-Feb-01-2019-12:09:18.mp4"
        config={{
          file: {
            forceVideo: true,
          },
        }}
      />
    </div>
  );
};

export default Video;
