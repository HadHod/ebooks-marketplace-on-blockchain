import { ethers } from 'ethers';
import { getEthereum, requestAccount } from '../UtilityFunctions';

interface UseWallet {
  connectWallet: any, // () => Promise<void>,
}

export function useWallet(newAddressCallback: any): UseWallet {
  async function connectWallet(): Promise<void> {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(getEthereum());
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    newAddressCallback(address);
  }

  return { connectWallet };
}
