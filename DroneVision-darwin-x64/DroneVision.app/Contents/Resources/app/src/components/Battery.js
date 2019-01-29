import React from "react";
import { Progress } from "semantic-ui-react";

const Battery = props => {
  const { percent } = props;
  const label = `Battery: ${percent}%`;
  return (
    <div id="battery">
      <Progress percent={percent} label={label} warning={false} indicating />
    </div>
  );
};

export default Battery;
