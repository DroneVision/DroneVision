import React from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import Build from './screens/Build';
import Run from './screens/Run'
import StatusContainer from './components/StatusContainer'

const Routes = props => (
    <Switch>
        <Route path="/build" component={Build}/>
        <Route path="/run" component={Run}/>
        <Route path="/status" component={StatusContainer}/>
        <Route exact path="/" component={Build}/>
    </Switch>
)

export default withRouter(Routes)