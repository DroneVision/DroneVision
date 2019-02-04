import React, { Component } from 'react';
import { Button, Grid } from 'semantic-ui-react';
const { ipcRenderer } = window.require('electron');

class FlyControls extends Component {
  realTimeFly = instruction => {
    console.log('sending single instruction to drone', instruction);
    ipcRenderer.send('single-instruction', instruction);
  };

  realTimeTakeOff = () => {
    console.log('sending single instruction to drone', 'takeoff');
    ipcRenderer.send('takeoff');
  };
  render() {
    const { distance } = this.props;
    return (
      <div id="manual-screen">
      <Grid padded centered>
        <Grid.Row columns={2}>
          <Grid.Column width={8}>
            <Button onClick={() => this.realTimeTakeOff()}>Take Off</Button>
          </Grid.Column>
          <Grid.Column>
            <Button onClick={() => this.realTimeFly(`land`)}>Land</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    );
  }
}

export default FlyControls;
