import React from "react";
import { Progress } from "semantic-ui-react";

const Battery = props => {
  const { percent } = props;
  const label = `Battery: ${percent}%`;
  return (
    <div id="battery">
      <Progress style={{width:"200px"}}percent={percent} label={label} warning={false} indicating size="small"/>
    </div>
  );
};

export default Battery;
