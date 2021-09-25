import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AddBook from './AddBook';

describe('AddBook', () => {
  beforeEach(() => {
    render(<AddBook />);
  });

  it('should render page elments', () => {
    expect(screen.getByText(/Add new book/i)).toBeInTheDocument();
    expect(screen.getByText(/Cover/i)).toBeInTheDocument();
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Files/i)).toBeInTheDocument();
  });

  it('Add book button should be disable by default', () => {
    const addBookButton = screen.getByText(/Add book/i);
    expect(addBookButton).toBeInTheDocument();
    expect(addBookButton).toBeDisabled();
  });

  it('Add book button should not be disable after input change', () => {
    const addBookButton = screen.getByText(/Add book/i);
    expect(addBookButton).toBeInTheDocument();
    const [priceInput] = screen.getAllByPlaceholderText(/Price in ETH/i) as HTMLInputElement[];
    expect(priceInput).toBeInTheDocument();
    fireEvent.change(priceInput, { target: { value: '0.001' } });
    expect(priceInput.value).toBe('0.001');

    expect(addBookButton).not.toBeDisabled();
  });
});
