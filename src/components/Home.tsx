import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import Book from './Book';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';
import './Home.scss';

const ETH_PRICE_QUERY: DocumentNode = gql`
  {
    bundles {
      ethPrice
    }
  }
`;

// TODO login to metamask https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial

function Home(): ReactElement {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery(ETH_PRICE_QUERY);
  const ethPrice: number = parseInt(data?.bundles[0].ethPrice || 0, 10);

  async function getBooks(): Promise<void> {
    setIsLoading(true);
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);
    try {
      const [booksIds, prices, available, sold] = await contract.getBooks();
      setBooks(booksIds.map((bookId: string, index: number) => ({
        id: bookId,
        price: parseInt(prices[index], 16),
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
  }, []);

  return (
    <div className="home">
      {isLoading && <div>Loading</div>}

      {!isLoading && books.length === 0 && <div>Library is empty</div>}

      {books.map(({ id, price, isAvailable, numberOfSold }) => (
        <Book key={id} id={id} price={price} isAvailable={isAvailable} numberOfSold={numberOfSold} ethPrice={ethPrice} />
      ))}
    </div>
  );
}

export default Home;
