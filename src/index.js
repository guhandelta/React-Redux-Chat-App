import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import { Login, Register } from './components/Auth'
import * as serviceWorker from './serviceWorker';
import firebase from './firebase'
import { setUser, clearUser } from './actions'
import Spinner from './Spinner'

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootreducer from './reducers';

const store = createStore(rootreducer, composeWithDevTools())

class Root extends React.Component {

  componentDidMount() {
    console.log(this.props.isLoading);
    // A listener to detect whether a user is available in the app
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push('/');
      } else { //When the listener fn() can't find the user
        this.props.history.push('/login');
        this.props.clearUser();//Clear the user from the global state
      }
    })
  }

  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
  // user is the property of the state holding the root_reducer obtained from combineReducers(), reducers/index.js
})

// Wrap the Root component with the withROuter HOC, to put the history object within the Root component
const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));
// connect(mapStateToProps, mapDispatchStateToProps{where the actions are received from})
// connect() and mapDispatchToProps will take the setUser action and put it on the props obj of component, which is wrapped with connect()
// mapStateToProps is passed as teh 1st arg to connect() to get the loading data from the state object, to see when the setUser action-
//- is still being loaded

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
