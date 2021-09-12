import { ReactElement } from 'react';
import './Book.scss';
import classNames from "classnames";

interface IBook {
  isAvailable: boolean;
  numberOfSold: number;
  price: number;
  ethPrice: number;
}

function Book({ isAvailable, numberOfSold, price, ethPrice }: IBook): ReactElement {
  const cover: string = 'https://images-na.ssl-images-amazon.com/images/I/41KdeY0zfOL._SX346_BO1,204,203,200_.jpg';
  const content: string = isAvailable ? 'Download (.pdf & .epub)' : `Buy (${price} ETH ≈ $${price * ethPrice})`;

  return (
    <div className="book">
      <div className="book__image-container">
        <div className="book__image-container__text">{ numberOfSold } sold</div>
        <img className="book__image-container__image" src={cover} width="105" height="150" alt="Book cover"></img>
      </div>

      <div className="book__content">
        <h3 className="book__content__title">Token Economy: How the Web3 reinvents the Internet</h3>
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed eros vel dolor dignissim iaculis. Duis eu ligula feugiat, pulvinar leo a, pharetra leo. Sed at accumsan felis. Suspendisse quis elit euismod, maximus leo quis, lobortis urna. Nunc interdum elit ac magna scelerisque mollis. Ut non scelerisque purus, sed luctus magna. Mauris semper mauris sem, non maximus enim fringilla vel. Aliquam vitae neque at erat ultricies posuere. Vestibulum tincidunt libero felis, eu blandit nulla hendrerit eu. Praesent velit nulla, blandit quis semper sed, facilisis ac enim.</div>
      </div>

      <div>
        <button className={classNames('ebm__button', 'book-button', {
          'ebm__button--available': isAvailable,
        })}>{ content }</button>
      </div>
    </div>
  );
}

export default Book;
