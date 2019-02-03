import React, { Component } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';

class Videos extends Component {
  render() {
    return (
      <div i="videos">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1" dividing id="centered-padded-top">
                <Icon name="settings" />
                <Header.Content>
                  AutoPilot Builder
                  <Header.Subheader>
                    <i>Visualize your build path</i>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Videos