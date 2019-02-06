import React, { Component } from 'react';
import { Grid, Header, Icon, List, Segment } from 'semantic-ui-react';
import VideoPlayer from '../components/VideoPlayer';
import Slider from 'react-slick';
const { ipcRenderer } = window.require('electron');

class Videos extends Component {
  constructor() {
    super();
    this.state = {
      availableVideos: [],
      selectedVideo: null,
    };

    ipcRenderer.send('get-available-videos');
    ipcRenderer.on('has-available-videos', (evt, videos) => {
      this.setState({ availableVideos: videos, selectedVideo: videos[0] });
    });
  }
  handleVideoClick = (e, { name }) => {
    this.setState({ selectedVideo: name });
  };

  render() {
    const { availableVideos } = this.state;
    return (
      <div id="videos">
        <Grid centered padded>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="video" />
                <Header.Content>
                  Video Library
                  <Header.Subheader>
                    <i>Watch your recorded videos</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <VideoPlayer video={this.state.selectedVideo} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment textAlign="center" compact id="video-list">
                <List link>
                  <List.Header>
                    <i>Recorded Videos</i>
                  </List.Header>
                  {availableVideos.map(video => {
                    return (
                      <List.Item
                        key={video}
                        as="a"
                        name={video}
                        onClick={this.handleVideoClick}
                      >
                        {video}
                      </List.Item>
                    );
                  })}
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Videos;
