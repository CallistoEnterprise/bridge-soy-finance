import BigNumber from 'bignumber.js';

const method = {
  type: 'function',
  stateMutability: 'nonpayable',
  outputs: [{ type: 'uint256[]', name: 'amounts', internalType: 'uint256[]' }],
  name: 'swapTokensForExactCLO',
  inputs: [
    { type: 'uint256', name: 'amountOut', internalType: 'uint256' },
    { type: 'uint256', name: 'amountInMax', internalType: 'uint256' },
    { type: 'address[]', name: 'path', internalType: 'address[]' },
    { type: 'address', name: 'to', internalType: 'address' },
    { type: 'uint256', name: 'deadline', internalType: 'uint256' }
  ]
};

const getEncodedData = async (web3: any, params: [BigNumber, BigNumber, [string, string], string, BigNumber]) => {
  // const today = new Date();
  // const deadline = today.setHours(today.getHours() + 1);
  // const funParams = [...params];
  const data = await web3.eth.abi.encodeFunctionCall(method, params);
  return data;
};

export default getEncodedData;
