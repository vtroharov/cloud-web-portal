import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Admin from './components/admin/Admin';
import Dashboard from './components/dashboard/Dashboard';
import DashboardAdmin from './components/dashboard/DashboardAdmin';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import Request from './components/request/Requests';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => { 
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
  <Provider store={store}>
    <Router>
        <Navbar />
        <Alert />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/register' component={Register} />
          <AdminRoute exact path='/admin' component={Admin} />
          <AdminRoute exact path='/dashboard-admin' component={DashboardAdmin} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/request' component={Request} />
        </Switch>
    </Router>
  </Provider>
)};

export default App;
