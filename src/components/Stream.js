import React from 'react';

const Stream = props => {
  return (
    <div>
      <video src="udp://192.168.10.1:11111" id="stream" />
    </div>
  );
};

export default Stream;
