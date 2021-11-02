import { ethers } from 'ethers';
import { BOOKS_MARKETPLACE_CONTRACT_ADDERSS } from '../Constants';
import { getEthereum } from '../UtilityFunctions';
import BooksMarketplace from '../../artifacts/contracts/BooksMarketplace.sol/BooksMarketplace.json';

interface UseMarketplaceContract {
  contract: ethers.Contract;
}

export function useMarketplaceContract(): UseMarketplaceContract {
  const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(getEthereum());
  const contract: ethers.Contract = new ethers.Contract(BOOKS_MARKETPLACE_CONTRACT_ADDERSS, BooksMarketplace.abi, provider);

  return { contract };
}
