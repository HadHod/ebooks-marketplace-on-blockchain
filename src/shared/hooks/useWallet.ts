import { ethers } from 'ethers';
import { getEthereum, requestAccount } from '../UtilityFunctions';

interface UseWallet {
  connectWallet: () => Promise<void>,
}

export function useWallet(newAddressCallback: (_: string) => void): UseWallet {
  async function connectWallet(): Promise<void> {
    await requestAccount();
    const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(getEthereum());
    const signer: ethers.providers.JsonRpcSigner = provider.getSigner();
    const address: string = await signer.getAddress();
    newAddressCallback(address);
  }

  return { connectWallet };
}
