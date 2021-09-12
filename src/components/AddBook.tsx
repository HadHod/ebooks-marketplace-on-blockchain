import { useState } from 'react';
import { ethers } from 'ethers';
import BooksMarketplace from './../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';
import './AddBook.scss';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';
// import pdfIcon from '../../public/images/pdf_icon.png';
// import epubIcon from '../../public/images/epub_icon.png';
// import { ReactComponent as PdfIcon } from './public/images/pdf-icon.svg';

// TODO add webpack https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9

function AddBook() {
  const [newBookPrice, setNewBookPrice] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function addBook() {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, signer);
    const randomId: string = Math.random().toString(32).substr(2, 9); // TODO get id from DB
    const transaction = await contract.addBook(randomId, newBookPrice);
    await transaction.wait();
  }

  // TODO Cover floating numbers

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
        <input className="add-book__row__input" type="text" placeholder="Book title"></input>
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Description</div>
        <input className="add-book__row__input" type="text" placeholder="description"></input>
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Price</div>
        <input className="add-book__row__input" type="number" min="0.01" step="0.01" onChange={e => setNewBookPrice(parseInt(e.target.value, 10))} placeholder="Price in ETH" />
      </div>
      <div className="add-book__row">
        <div className="add-book__row__label">Files</div>
        <div>
          <label>
            <input type="file" accept="application/pdf" className="display-none" />
            <img className="add-book__row__icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/267px-PDF_file_icon.svg.png" alt="upload pdf file" width="28" height="40"></img>
          </label>
          <label>
            <input type="file" accept="application/epub+zip" className="display-none" />
            <img className="add-book__row__icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Icon_epub_file.svg/334px-Icon_epub_file.svg.png" alt="upload pdf file" width="28" height="40"></img>
          </label>
        </div>
      </div>

      <button className="ebm__button" onClick={addBook} disabled={newBookPrice === 0}>Add Book</button>
    </div>
  );
}

export default AddBook;
