import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import Home from './components/Home';
import AddBook from './components/AddBook';
import Navigation from './components/Navigation';

// TODO Notifications
// TODO Error handling
// TODO Connect wallet

function App(): ReactElement {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Switch>
          <Route path="/add-book">
            <AddBook />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
