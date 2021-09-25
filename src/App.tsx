import React, { ReactElement, useEffect, useState } from 'react';
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
import BooksMarketplace from './artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from './Constants';
import { getLastChars, requestAccount } from './shared/UtilityFunctions';

// TODO Notification
// TODO Error handling
// TODO connect wallet

function App(): ReactElement {
  const [userName, setUserName] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState('0');

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

  async function updateOwnerStatusAndBalance(): Promise<void> {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    try {
      setBalance(ethers.utils.formatEther(await contract.getBalance()));
      setIsOwner(true);
    } catch (err) {
      setBalance('0');
      setIsOwner(false);
    }
  }

  function watchEvents(): void {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    contract.on('BooksUpdated', () => {
      updateOwnerStatusAndBalance();
    });
  }

  useEffect(() => {
    updateOwnerStatusAndBalance();
    watchEvents();
  }, []);

  function getTreasuryBalanceValue(): string {
    return `Treasury: ${balance} ETH`;
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
            {isOwner && <span className="app__navigation__actions__treasury">{ getTreasuryBalanceValue() }</span>}
            {isOwner && <Link className="app__navigation__link" to="/add-book">Add</Link>}
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
