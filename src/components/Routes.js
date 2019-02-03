import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Build from '../screens/Build';
import Run from '../screens/Run';
import FlyScreen from '../screens/FlyScreen';
import Navbar from './Navbar';
import Footer from './Footer';
import Sandbox from './Sandbox';
import Videos from './Videos';

const Routes = props => (
  <div>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Build} />
      <Route path="/build" component={Build} />
      <Route path="/run" component={Run} />
      <Route path="/fly" component={FlyScreen} />
      <Route path="/videos" component={Videos}/>
      <Route path="/sandbox" component={Sandbox} />
    </Switch>
    <Footer />
  </div>
);

export default withRouter(Routes);
