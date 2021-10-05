import { ethers } from 'ethers';
import { requestAccount } from '../UtilityFunctions';

export function useWallet(newAddressCallback: any): any {
  async function connectWallet(): Promise<void> {
    const { ethereum } = window;
    if (typeof ethereum === 'undefined') {
      return;
    }
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    newAddressCallback(address);
  }

  return { connectWallet };
}
