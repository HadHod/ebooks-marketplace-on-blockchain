import React, { ReactElement, useEffect, useState } from 'react';
import './Book.scss';
import { ethers } from 'ethers';
import classNames from 'classnames';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../shared/Constants';
import { IBook } from '../shared/interfaces/IBook';
import { getEthereum, requestAccount, round } from '../shared/UtilityFunctions';
import { Loader } from '../shared/components/Loader';

function Book({ id, isAvailable, numberOfSold, price, ethPrice }: IBook): ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const priceInETH: number = parseFloat(ethers.utils.formatEther(price));
  const content: string = isAvailable ? 'Download' : `Buy (${priceInETH} ETH ≈ $${round(priceInETH * ethPrice)})`;

  async function onClick(): Promise<void> {
    if (isAvailable) {
      /* eslint-disable-next-line */
      alert('Downloading ...');
    } else {
      setIsLoading(true);
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(getEthereum());
      const signer = provider.getSigner();
      const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, signer);
      try {
        const transaction = await contract.buyBook(id, { value: price });
        await transaction.wait();
      } catch (err) {
        setIsLoading(false);
      }
    }
  }

  function watchEvents(): void {
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    contract.on('BooksUpdated', () => {
      setIsLoading(false);
    });
  }

  useEffect(() => {
    watchEvents();
  }, []);

  function getButton(): ReactElement {
    return (
      <button
        onClick={onClick}
        type="button"
        className={classNames('ebm__button', {
          'ebm__button--available': isAvailable,
        })}
      >
        { content }
      </button>
    );
  }

  return (
    <div className="book">
      <div className="book__image-container">
        <div className="book__image-container__text">
          { numberOfSold }
          {' '}
          sold
        </div>
        <img
          className="book__image-container__image"
          src={`${process.env.PUBLIC_URL}/images/token_economy_cover.jpg`}
          width="105"
          height="150"
          alt="Book cover"
        />
      </div>

      <div className="book__content">
        <h3 className="book__content__title">Token Economy: How the Web3 reinvents the Internet</h3>
        {/* eslint-disable-next-line */}
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed eros vel dolor dignissim iaculis. Duis eu ligula feugiat, pulvinar leo a, pharetra leo. Sed at accumsan felis. Suspendisse quis elit euismod, maximus leo quis, lobortis urna. Nunc interdum elit ac magna scelerisque mollis. Ut non scelerisque purus, sed luctus magna. Mauris semper mauris sem, non maximus enim fringilla vel. Aliquam vitae neque at erat ultricies posuere. Vestibulum tincidunt libero felis, eu blandit nulla hendrerit eu. Praesent velit nulla, blandit quis semper sed, facilisis ac enim.</div>
      </div>

      <div className="book__button-wrapper">
        {isLoading && <Loader />}
        {!isLoading && getButton()}
      </div>
    </div>
  );
}

export default Book;
