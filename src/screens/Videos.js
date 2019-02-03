import React, { Component } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import VideoPlayer from '../components/VideoPlayer';

class Videos extends Component {
  render() {
    return (
      <div i="videos">
        <Grid>
          <Grid.Row>
            <Grid.Column >
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="video" />
                <Header.Content>
                  My Video Library
                  <Header.Subheader>
                    <i>Watch your recorded videos</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row>
            <Grid.Column>
              <VideoPlayer/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Videos