import { Interface } from '@ethersproject/abi';
import { Currency, Pair, TokenAmount } from '@soy-libs/sdk2';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { useMemo } from 'react';
import { useMultipleContractSingleData } from '~/app/modules/multicall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';
// import useActiveWeb3React from './useActiveWeb3React';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  // const { chainId } = useActiveWeb3React();
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, 20729),
        wrappedCurrency(currencyB, 20729)
      ]),
    [currencies]
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined;
      }),
    [tokens]
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      ];
    });
  }, [results, tokens]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
