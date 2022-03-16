import addresses from '~/app/constants/contracts';
import { Address } from '~/app/constants/types';

export const getAddress = (address: Address | any, chainId = 820): string => {
  return address[chainId] ? address[chainId] : address[820];
};

export const getSoyRouterAddress = (): string => {
  return getAddress(addresses.soyRouter);
};

export const getBridgeAddress = (chainId: number): string => {
  return getAddress(addresses.bridge, chainId);
};
