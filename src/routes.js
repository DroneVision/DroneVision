import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Build from './screens/Build';
import Run from './screens/Run';
import StatusContainer from './components/StatusContainer';
import Navbar from './components/Navbar';
import ThreeContainer from './components/ThreeContainer';

const Routes = props => (
  <div>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Build} />
      <Route path="/build" component={Build} />
      <Route path="/three" component={ThreeContainer} />
      <Route path="/run" component={Run} />
    </Switch>
  </div>
);

export default withRouter(Routes);
