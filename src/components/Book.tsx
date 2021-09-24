import React, { ReactElement } from 'react';
import './Book.scss';
import { BigNumber, ethers } from 'ethers';
import classNames from 'classnames';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';

interface IBook {
  id: string;
  isAvailable: boolean;
  numberOfSold: number;
  price: BigNumber;
  ethPrice: number;
}

function Book({ id, isAvailable, numberOfSold, price, ethPrice }: IBook): ReactElement {
  const priceInETH: number = parseInt(ethers.utils.formatEther(price), 10);
  const cover: string = 'https://images-na.ssl-images-amazon.com/images/I/41KdeY0zfOL._SX346_BO1,204,203,200_.jpg';
  const content: string = isAvailable ? 'Download (.pdf & .epub)' : `Buy (${priceInETH} ETH ≈ $${priceInETH * ethPrice})`;

  async function requestAccount(): Promise<void> {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function onClick(): Promise<void> {
    if (isAvailable) {
      /* eslint-disable-next-line */
      alert('Downloading ...');
    } else {
      const { ethereum } = window;
      if (typeof ethereum === 'undefined') {
        return;
      }

      await requestAccount();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, signer);
      try {
        const transaction = await contract.buyBook(id, { value: price });
        await transaction.wait();
        /* eslint-disable-next-line */
        // alert('Book successfuly puchased');
      } catch (err) {
        /* eslint-disable-next-line */
        console.log(err);
      }
    }
  }

  return (
    <div className="book">
      <div className="book__image-container">
        <div className="book__image-container__text">
          { numberOfSold }
          {' '}
          sold
        </div>
        <img className="book__image-container__image" src={cover} width="105" height="150" alt="Book cover" />
      </div>

      <div className="book__content">
        <h3 className="book__content__title">Token Economy: How the Web3 reinvents the Internet</h3>
        {/* eslint-disable-next-line */}
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed eros vel dolor dignissim iaculis. Duis eu ligula feugiat, pulvinar leo a, pharetra leo. Sed at accumsan felis. Suspendisse quis elit euismod, maximus leo quis, lobortis urna. Nunc interdum elit ac magna scelerisque mollis. Ut non scelerisque purus, sed luctus magna. Mauris semper mauris sem, non maximus enim fringilla vel. Aliquam vitae neque at erat ultricies posuere. Vestibulum tincidunt libero felis, eu blandit nulla hendrerit eu. Praesent velit nulla, blandit quis semper sed, facilisis ac enim.</div>
      </div>

      <div>
        {/* eslint-disable-next-line */}
        <button onClick={onClick} className={classNames('ebm__button', 'book-button', {
          'ebm__button--available': isAvailable,
        })}
        >
          { content }
        </button>
      </div>
    </div>
  );
}

export default Book;
