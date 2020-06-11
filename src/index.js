import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import { Login, Register } from './components/Auth'
import * as serviceWorker from './serviceWorker';
import firebase from './firebase'

class Root extends React.Component {

  componentDidMount() {
    // A listener to detect whether a user is available in the app
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/')
      }
    })
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
      </Switch>
    );
  }
}

// Wrap the Root component with the withROuter HOC, to put the history object within the Root component
const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <Router>
    <RootWithAuth />
  </Router>, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
