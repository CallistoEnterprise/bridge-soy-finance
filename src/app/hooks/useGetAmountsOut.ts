import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import useGetWalletState from '../modules/wallet/hooks';
import { getSoyRouterContractByWeb3 } from '../utils';
import { getDecimalAmount } from '../utils/decimal';
import { useWeb3Provider } from './wallet';

const BIG_ZERO = new BigNumber(0);

export const useGetAmountsOut = (amount: string) => {
  const [amountsOut, setAmountsOut] = useState(BIG_ZERO);
  const rpc = process.env.REACT_APP_NODE_1;
  const provider = useWeb3Provider(rpc);
  const { selectedToken, toNetwork } = useGetWalletState();
  const swapTokenAddrInCallisto = selectedToken?.address[820];

  useEffect(() => {
    const fetch = async () => {
      const contract = await getSoyRouterContractByWeb3(provider);
      const bigAmount = getDecimalAmount(new BigNumber(amount));
      const path = [swapTokenAddrInCallisto, '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a'];
      const outAmt = await contract.methods.getAmountsOut(bigAmount.toString(), path).call();
      setAmountsOut(outAmt[1]);
    };
    if (!Number.isNaN(parseFloat(amount)) && swapTokenAddrInCallisto !== '' && toNetwork.chainId === '820') {
      fetch();
    } else {
      setAmountsOut(BIG_ZERO);
    }
  }, [amount, provider, selectedToken, swapTokenAddrInCallisto, toNetwork.chainId]);

  return amountsOut;
};

export const useGetAmountsInput = (amount: string) => {
  const [amountsOut, setAmountsOut] = useState(BIG_ZERO);
  const rpc = process.env.REACT_APP_NODE_1;
  const provider = useWeb3Provider(rpc);
  const { selectedToken, toNetwork } = useGetWalletState();
  const swapTokenAddrInCallisto = selectedToken?.address[820];

  useEffect(() => {
    const fetch = async () => {
      const contract = await getSoyRouterContractByWeb3(provider);
      const bigAmount = getDecimalAmount(new BigNumber(amount));

      const path = [swapTokenAddrInCallisto, '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a'];
      const outAmt = await contract.methods.getAmountsIn(bigAmount.toString(), path).call();
      setAmountsOut(outAmt[0]);
    };
    if (!Number.isNaN(parseFloat(amount)) && swapTokenAddrInCallisto !== '' && toNetwork.chainId === '820') {
      fetch();
    } else {
      setAmountsOut(BIG_ZERO);
    }
  }, [amount, provider, selectedToken, swapTokenAddrInCallisto, toNetwork.chainId]);

  return amountsOut;
};
