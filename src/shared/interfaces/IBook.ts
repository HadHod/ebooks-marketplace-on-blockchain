import { BigNumber } from 'ethers';

export interface IBook {
  id: string;
  isAvailable: boolean;
  numberOfSold: number;
  price: BigNumber;
  ethPrice: number;
}
