import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import { Login, Register } from './components/Auth'
import * as serviceWorker from './serviceWorker';
import firebase from './firebase'
import { setUser } from './actions'

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootreducer from './reducers';

const store = createStore(rootreducer, composeWithDevTools())

class Root extends React.Component {

  componentDidMount() {
    // A listener to detect whether a user is available in the app
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push('/');
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
const RootWithAuth = withRouter(connect(null, { setUser })(Root));
// connect(mapStateToProps, mapDispatchStateToProps{where the actions are received from})
// connect() and mapDispatchToProps will take the setUser action and put it on the props obj of component, which is wrapped with connect()


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </ Provider>, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
