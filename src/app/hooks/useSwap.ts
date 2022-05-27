import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { getBridgeContract } from '../utils';
import { getBridgeAddress, getSoyRouterAddressByChain } from '../utils/addressHelpers';
import useActiveWeb3React from './useActiveWeb3';

const useSwap = () => {
  const { library, account, chainId } = useActiveWeb3React();

  const handleSimpleSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, value: string) => {
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      const tx = await bridgeContract.depositTokens(receiver, tkAddress, amount.toString(), toChainId, {
        value
      });

      return {
        status: false,
        hash: tx.hash
      };
    },
    [library, account, chainId]
  );

  const handleAdvancedSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, byteData: any, value: string) => {
      const router = await getSoyRouterAddressByChain(toChainId);
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      const tx = await bridgeContract.bridgeToContract(
        receiver,
        tkAddress,
        amount.toString(),
        toChainId,
        router,
        byteData,
        {
          value
        }
      );

      return {
        status: false,
        hash: tx.hash
      };
    },
    [library, account, chainId]
  );

  return { onSimpleSwap: handleSimpleSwap, onAdvancedSwap: handleAdvancedSwap };
};

export default useSwap;
