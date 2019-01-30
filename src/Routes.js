import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Build from './screens/Build';
import Run from './screens/Run';
import About from './screens/About';
import FlyScreen from './screens/FlyScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Routes = props => (
  <div>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Build} />
      <Route path="/build" component={Build} />
      <Route path="/run" component={Run} />
      <Route path="/fly" component={FlyScreen} />
      <Route path="/about" component={About} />
    </Switch>
    <Footer />
  </div>
);

export default withRouter(Routes);
