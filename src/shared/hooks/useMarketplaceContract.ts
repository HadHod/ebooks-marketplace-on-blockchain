import { ethers } from 'ethers';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';
import { getEthereum } from '../UtilityFunctions';
import BooksMarketplace from '../../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';

export function useMarketplaceContract(): any {
  const provider = new ethers.providers.Web3Provider(getEthereum());
  const contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);

  return { contract };
}
