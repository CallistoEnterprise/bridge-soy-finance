import axios from 'axios';
import { CLAIMAPI } from '../constants/endpoints';

export const submitClaimAction = async (tx: string, chainId: number | string) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(`${CLAIMAPI}/tx=${tx}&chain=${chainId}`).then((res) => {
        resolve(res);
      });
    } catch (err) {
      reject(false);
    }
  });
};
