import React, { ReactElement, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import BooksMarketplace from '../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import './AddBook.scss';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../shared/Constants';
import { getEthereum, requestAccount } from '../shared/UtilityFunctions';

const STEP: string = '0.0001';
const DEFAULT_PRICE: BigNumber = BigNumber.from('0');

function AddBook(): ReactElement {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [isDisabled, setIsDisabled] = useState(true);

  async function addBook(): Promise<void> {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const signer = provider.getSigner();
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, signer);
    const randomId: string = Math.random().toString(32).substr(2, 9); // TODO get id from DB
    try {
      const transaction = await contract.addBook(randomId, price);
      await transaction.wait();
    } catch (error: unknown) {
      /* eslint-disable-next-line */
      console.log(error);
    } finally {
      setPrice(DEFAULT_PRICE);
    }
  }

  useEffect(() => {
    setIsDisabled(price === DEFAULT_PRICE);
  }, [price]);

  return (
    <div className="add-book">
      <h3>Add new book</h3>
      <div className="add-book__row">
        <div className="add-book__row__label">Cover</div>
        <label>
          <input type="file" accept="image/png, image/jpeg" className="display-none" />
          .png / .jpeg
        </label>
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Title</div>
        <input className="add-book__row__input" type="text" placeholder="title" />
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Description</div>
        <input className="add-book__row__input" type="text" placeholder="description" />
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Price</div>
        <input
          className="add-book__row__input"
          type="number"
          min={STEP}
          step={STEP}
          value={ethers.utils.formatEther(price)}
          onChange={(e) => setPrice(ethers.utils.parseEther(e.target.value))}
          placeholder="Price in ETH"
        />
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Files</div>
        <div>
          <label>
            <input type="file" accept="application/pdf" className="display-none" />
            <img
              className="add-book__row__icon"
              src={`${process.env.PUBLIC_URL}/images/pdf_icon.png`}
              alt="upload pdf file"
            />
          </label>
          <label>
            <input type="file" accept="application/epub+zip" className="display-none" />
            <img
              className="add-book__row__icon"
              src={`${process.env.PUBLIC_URL}/images/epub_icon.png`}
              alt="upload epub file"
            />
          </label>
        </div>
      </div>

      <button className="ebm__button" onClick={addBook} disabled={isDisabled} type="button">Add Book</button>
    </div>
  );
}

export default AddBook;
