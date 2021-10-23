import { EthereumProvider } from 'hardhat/types';

export async function requestAccount(): Promise<void> {
  const ethereum = getEthereum();
  await ethereum?.request({ method: 'eth_requestAccounts' });
}

export function getLastChars(word: string, chars: number): string {
  return word.substr(word.length - chars);
}

export function round(num: number, places: number = 2): number {
  const decimals: number = 10 ** places;
  return Math.round(num * decimals) / decimals;
}

export function getEthereum(): any { // ExternalProvider | JsonRpcFetchFunc
  const ethereum: EthereumProvider = window.ethereum;
  return typeof ethereum === 'undefined' ? null : ethereum;
}
