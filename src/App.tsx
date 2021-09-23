import React, { ReactElement, useState } from 'react';
import { ethers } from 'ethers';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import './App.scss';
import Home from './components/Home';
import AddBook from './components/AddBook';

function App(): ReactElement {
  const [userName, setUserName] = useState('');

  function getLastChars(word: string, chars: number): string {
    return word.substr(word.length - chars);
  }

  async function requestAccount(): Promise<void> {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function connectWallet(): Promise<void> {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined' || userName !== '') {
      return;
    }
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setUserName(address);
  }

  return (
    <Router>
      <div className="app">
        <nav className="app__navigation">
          <div className="app__navigation__header">
            <Link className="app__navigation__link" to="/">Home</Link>
            <span>Buy ebooks with ETH</span>
          </div>
          <div className="app__navigation__actions">
            <Link className="app__navigation__link" to="/add-book">Add</Link>
            <button className="app__navigation__link app__navigation__link--connect-button" onClick={connectWallet} type="button">
              { userName === '' ? 'Connect' : `...${getLastChars(userName, 4)}` }
            </button>
          </div>
        </nav>

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
