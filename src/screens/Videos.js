import React, { Component } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import VideoPlayer from '../components/VideoPlayer';
import Slider from 'react-slick';
const { ipcRenderer } = window.require('electron');

class Videos extends Component {
  constructor() {
    super();
    ipcRenderer.send('get-available-videos');
    ipcRenderer.on('has-available-videos', (evt, arg) => {
      console.log('videos', arg)
    })
  }
  componentDidMount() {
    
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div i="videos">
        <Grid centered padded>
          <Grid.Row>
            <Grid.Column>
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
              <VideoPlayer video="DroneVision-Feb-01-2019-12:09:38" />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Slider {...settings}>
                <div>
                  <h3>1</h3>
                </div>
                <div>
                  <h3>2</h3>
                </div>
                <div>
                  <h3>3</h3>
                </div>
                <div>
                  <h3>4</h3>
                </div>
                <div>
                  <h3>5</h3>
                </div>
                <div>
                  <h3>6</h3>
                </div>
              </Slider>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Videos;
