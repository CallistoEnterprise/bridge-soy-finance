import { TOKENLIST } from '@callisto-enterprise/assetslist';

// const getImageUrl = (symbol: any) => {
//  return `https://callistobridge.netlify.app/images/${symbol}.png`;
// };

type ChainIDs = 820 | 20729;

export const getTokenLogoLink = (address: string, chainId: ChainIDs = 820) => {
  return TOKENLIST[chainId].find((entry) => entry.address.toLowerCase() === address.toLowerCase()).image;

  /* return address === '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53'
    ? 'https://app.soy.finance/images/coins/clo.png'
    : `https://deploy-preview-25--multichain-soy-finance.netlify.app/images/coins/${chainId}/${address}.png`; */
};

//https://app.soy.finance/

// export default getImageUrl;
