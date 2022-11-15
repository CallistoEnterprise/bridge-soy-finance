export const getTokenLogoLink = (address: string, chainId = 820) => {
  return address === '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53'
    ? 'https://app.soy.finance/images/coins/clo.png'
    : `https://app.soy.finance/images/coins/${chainId}/${address}.png`;
};

//https://app.soy.finance/
