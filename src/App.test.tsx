import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ETH_PRICE_QUERY } from './shared/GraphQLQueries';
import App from './App';

const mocks = [{
  request: {
    query: ETH_PRICE_QUERY,
    variables: {},
  },
  result: {
    data: {
      bundles: [{ ethPrice: 3210 }],
    },
  },
}];

describe('App', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>,
    );
  });

  it('should render page elments', () => {
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Buy ebooks with ETH/i)).toBeInTheDocument();
    expect(screen.queryByText(/Add/i)).toBeNull();
    expect(screen.getByText(/Connect/i)).toBeInTheDocument();
  });
});
