import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Alert from './components/layouts/Alert';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'
import CreateProfile from  './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'

import './App.css';
import store from './store'

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App =() => {
  useEffect(()=>{
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
            <section className="container">
              <Alert />
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
              </Switch>
            </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
