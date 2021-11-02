import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BOOKS_UPDATE_EVENT } from '../shared/Constants';
import { getEthereum, getLastChars } from '../shared/UtilityFunctions';
import './Navigation.scss';
import { useWallet } from '../shared/hooks';

function Navigation(): ReactElement {
  const [userName, setUserName] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState('0');
  const { connectWallet } = useWallet(setUserName);

  async function updateOwnerStatusAndBalance(): Promise<void> {
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    try {
      setBalance(ethers.utils.formatEther(await contract.getBalance()));
      setIsOwner(true);
    } catch (err) {
      setBalance('0');
      setIsOwner(false);
    }
  }

  useEffect(() => {
    updateOwnerStatusAndBalance();

    const provider = new ethers.providers.Web3Provider(getEthereum());
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    contract.on(BOOKS_UPDATE_EVENT, updateOwnerStatusAndBalance);
    return () => {
      contract.off(BOOKS_UPDATE_EVENT, updateOwnerStatusAndBalance);
    };
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
        <button
          className="navigation__link navigation__link--connect-button"
          onClick={connectWallet}
          type="button"
          disabled={userName !== ''}
        >
          { userName === '' ? 'Connect' : `...${getLastChars(userName, 4)}` }
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
