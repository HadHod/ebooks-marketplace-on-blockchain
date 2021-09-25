import React from 'react';
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import Book from './Book';
import { IBook } from '../shared/interfaces/IBook';

const props: IBook = {
  id: 'abcdefghijklmno',
  isAvailable: true,
  numberOfSold: 0,
  price: BigNumber.from('42'),
  ethPrice: 100,
};

describe('Book', () => {
  beforeEach(() => {
    render(
      <Book
        id={props.id}
        isAvailable={props.isAvailable}
        numberOfSold={props.numberOfSold}
        price={props.price}
        ethPrice={props.ethPrice}
      />,
    );
  });

  it('should render page elments', () => {
    expect(screen.getByText(/Download \(\.pdf & \.epub\)/i)).toBeInTheDocument();
  });
});
