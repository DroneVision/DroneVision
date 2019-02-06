import React, { Component } from 'react';
import { Button, Grid, Icon, Image } from 'semantic-ui-react';
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
    const { distance: meters } = this.props;
    const distance = meters * 100;
    return (
      <div id="manual-screen">
        <Grid centered>
          <Grid.Row columns={2}>
            <Grid.Column id="centered">
              <Button
                color="facebook"
                labelPosition="left"
                icon="military"
                content="Take Off"
                onClick={() => this.realTimeTakeOff()}
              />
              {/* </Grid.Column>
            <Grid.Column id="centered"> */}
              <Button
                color="facebook"
                labelPosition="left"
                icon="military"
                content="Land"
                onClick={() => this.realTimeFly(`land`)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1}>
            <Grid.Column id="centered">
              <Button
                content={<Icon name="arrow up" />}
                onClick={() => this.realTimeFly(`forward ${distance}`)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={4}>
            <Grid.Column id="centered">
              <Button
                content={<Icon name="arrow left" />}
                onClick={() => this.realTimeFly(`left ${distance}`)}
              />
              <Button
                onClick={() => this.realTimeFly(`up ${distance}`)}
                content="Up"
              />
              <Button
                onClick={() => this.realTimeFly(`down ${distance}`)}
                content="Down"
              />
              <Button
                content={<Icon name="arrow right" />}
                onClick={() => this.realTimeFly(`right ${distance}`)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column id="centered">
              <Button
                content={<Icon name="arrow down" />}
                onClick={() => this.realTimeFly(`back ${distance}`)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column id="centered">
              <Button onClick={() => this.realTimeFly(`flip f`)}>
                Front-Flip
              </Button>

              <Button onClick={() => this.realTimeFly(`flip b`)}>
                Back-Flip
              </Button>

              <Button onClick={() => this.realTimeFly(`flip l`)}>
                Left-Flip
              </Button>

              <Button onClick={() => this.realTimeFly(`flip r`)}>
                Right-Flip
              </Button>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column id="centered">
              <Button
                icon={<Icon name="hand paper" />}
                color="youtube"
                content="Emergency"
                onClick={() => this.realTimeFly(`emergency`)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default FlyControls;
