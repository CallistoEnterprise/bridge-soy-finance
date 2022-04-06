import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { DEFAULT_GAS_LIMIT } from '../constants';
import { getBridgeContract } from '../utils';
import { getBridgeAddress, getSoyRouterAddress } from '../utils/addressHelpers';
import useActiveWeb3React from './useActiveWeb3';

const useSwap = () => {
  const { library, account, chainId } = useActiveWeb3React();

  const handleSimpleSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, value: string) => {
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      const tx = await bridgeContract.depositTokens(receiver, tkAddress, amount.toString(), toChainId, {
        value,
        gasLimit: DEFAULT_GAS_LIMIT
      });
      // const receipt = await tx.wait(64);
      return {
        status: false,
        hash: tx.hash
      };
    },
    [library, account, chainId]
  );

  const handleAdvancedSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, byteData: any, value: string) => {
      const router = await getSoyRouterAddress();
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
          value,
          gasLimit: DEFAULT_GAS_LIMIT
        }
      );
      // const receipt = await tx.wait();
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
