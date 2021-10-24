import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useQuery } from '@apollo/client';
import Book from './Book';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BOOKS_UPDATE_EVENT } from '../shared/Constants';
import { ETH_PRICE_QUERY } from '../shared/GraphQLQueries';
import { Loader } from '../shared/components/Loader';
import './Home.scss';
import { getEthereum } from '../shared/UtilityFunctions';

function Home(): ReactElement {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery(ETH_PRICE_QUERY);
  const ethPrice: number = parseInt(data?.bundles[0].ethPrice || 0, 10);

  async function getBooks(): Promise<void> {
    setIsLoading(true);
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    try {
      const [booksIds, prices, available, sold] = await contract.getBooks();
      setBooks(booksIds.map((bookId: string, index: number) => ({
        id: bookId,
        price: prices[index],
        isAvailable: available[index],
        numberOfSold: parseInt(sold[index], 16),
      })));
    } catch (err) {
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }

  function watchEvents(): void {
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    contract.on(BOOKS_UPDATE_EVENT, () => {
      getBooks();
    });
  }

  useEffect(() => {
    getBooks();
    watchEvents();
  }, []);

  function showLoader(): ReactElement {
    return (
      <div className="loader-wrapper">
        <Loader />
      </div>
    );
  }

  function libraryIsEmpty(): ReactElement {
    return (
      <div className="empty-library">
        <img
          className="empty-library__image"
          src={`${process.env.PUBLIC_URL}/images/empty_library.png`}
          alt="library is empty"
        />
        <span className="empty-library__text">Library is empty</span>
      </div>
    );
  }

  return (
    <div className="home">
      {isLoading && showLoader()}

      {!isLoading && books.length === 0 && libraryIsEmpty()}

      {books.map(({ id, price, isAvailable, numberOfSold }) => (
        <Book key={id} id={id} price={price} isAvailable={isAvailable} numberOfSold={numberOfSold} ethPrice={ethPrice} />
      ))}
    </div>
  );
}

export default Home;
