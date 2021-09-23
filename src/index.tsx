import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  }),
  cache: new InMemoryCache(),
});

declare global {
  /* eslint-disable-next-line */
  interface Window { ethereum: any; }
}
window.ethereum = window.ethereum || {};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
