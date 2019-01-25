import React from 'react';
import StatusContainer from '../components/StatusContainer';
import Canvas from '../components/Canvas';
import Stream from '../components/Stream';

const Run = props => {
  return (
    <div>
      <table>
        <tr>
          <td>
            <Canvas />
          </td>
          <td>
            <Stream />
          </td>
        </tr>
      </table>
      <StatusContainer />
    </div>
  );
};

export default Run;
