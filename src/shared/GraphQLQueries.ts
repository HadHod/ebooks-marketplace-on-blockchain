import { gql, DocumentNode } from '@apollo/client';

export const ETH_PRICE_QUERY: DocumentNode = gql`
  {
    bundles {
      ethPrice
    }
  }
`;
