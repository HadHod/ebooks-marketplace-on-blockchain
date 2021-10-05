import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../shared/Constants';
import { getLastChars, requestAccount } from '../shared/UtilityFunctions';
import './Navigation.scss';

function Navigation(): ReactElement {
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

  return (
    <nav className="navigation">
      <div className="navigation__header">
        <Link className="navigation__link" to="/">Home</Link>
        <span>Buy ebooks with ETH</span>
      </div>
      <div className="navigation__actions">
        {isOwner && <span className="navigation__actions__treasury">{ `Treasury: ${balance} ETH` }</span>}
        {isOwner && <Link className="navigation__link" to="/add-book">Add</Link>}
        <button className="navigation__link navigation__link--connect-button" onClick={connectWallet} type="button">
          { userName === '' ? 'Connect' : `...${getLastChars(userName, 4)}` }
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
