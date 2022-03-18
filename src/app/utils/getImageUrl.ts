const getImageUrl = (symbol: any) => {
  return `https://callistobridge.netlify.app/images/${symbol}.png`;
};
export const getTokenLogoLink = (address: string) => {
  return `https://app.soy.finance/images/${address}.png`;
};

export default getImageUrl;
