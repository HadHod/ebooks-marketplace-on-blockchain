import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Book from './Book';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';
import './Home.scss';

// TODO login to metamask https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial
// TODO DL ETH price via the Graph https://thegraph.com/explorer/subgraph?id=0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0-0&view=Playground

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function Home(): ReactElement {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);

  async function getBooks(): Promise<void> {
    setIsLoading(true);
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    try {
      const booksData = await contract.getBooks();
      /* eslint-disable-next-line */
      console.log(booksData);
      const [booksIds, prices, available] = booksData;
      setBooks(booksIds.map((bookId: string, index: number) => ({
        id: bookId,
        price: parseInt(prices[index], 16),
        isAvailable: available[index],
      })));
    } catch (err) {
      setBooks([]);
    } finally {
      setIsLoading(false);
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
      getBooks();
    });
  }

  useEffect(() => {
    getBooks();
    watchEvents();
    setEthPrice(3356);
  }, []);

  return (
    <div className="home">
      {isLoading && <div>Loading</div>}
      {!isLoading && books.length === 0 && <div>No books to display</div>}
      {books.map(({ id, price, isAvailable }) => <Book key={id} id={id} isAvailable={isAvailable} numberOfSold={getRandomInt(1000)} price={price} ethPrice={ethPrice} />)}
    </div>
  );
}

export default Home;
