import React from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import Build from "./screens/Build";
import Run from "./screens/Run";
import StatusContainer from "./components/StatusContainer";
import Navbar from "./components/Navbar";

const Routes = props => (
  <div>
    <Navbar />
    <Switch>
      <Route path="/build" component={Build} />
      <Route path="/run" component={Run} />
      <Route exact path="/" component={Build} />
    </Switch>
  </div>
);

export default withRouter(Routes);
