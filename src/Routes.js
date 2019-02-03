import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Build from './screens/Build';
import Run from './screens/Run';
import Videos from './screens/Videos'
import About from './screens/About';
import FlyScreen from './screens/FlyScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


const Routes = props => (
  <div id="body">
    <div id="left-column" />
    <div id="right-column" />
    <Navbar />
    <Switch>
      <Route exact path="/" component={Build} />
      {/* <Route path='/scene-builder' component={Scene}/> */}
      <Route path="/path-builder" component={Build} />
      <Route path="/autopilot" component={Run} />
      <Route path="/manual-flight" component={FlyScreen} />
      <Route path="/videos" component={Videos}/>
      <Route path="/about" component={About} />
    </Switch>
    <Footer />
  </div>
);

export default withRouter(Routes);
