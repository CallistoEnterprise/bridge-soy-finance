// Array of available nodes to connect to
const sigs = [
  'https://s32df63t4aw7rqbszb57aqdfsq0tufuk.lambda-url.us-east-1.on.aws/auth?',
  'https://3lpvapi5h4tobz6a6h35276oqa0mijmd.lambda-url.us-east-1.on.aws/auth?',
  'https://srs27mbzuopehskfhvkdrdjwqi0qpjxk.lambda-url.us-west-2.on.aws/auth?'
];

const getSignatures = async (hash: string, chainId: string) => {
  const signatures: any = [];
  const { sig3, respJSON } = await getThirdSig(hash, chainId);
  if (sig3) {
    signatures.push(sig3);
  }
  //  else {
  //   return { signatures, respJSON: {} };
  // }
  const sig2 = await getSecondSig(hash, chainId);
  if (sig2) {
    signatures.push(sig2);
  }
  const sig1 = await getFirstSig(hash, chainId);
  if (sig1) {
    signatures.push(sig1);
  }

  return { signatures, respJSON };
};
const getFirstSig = async (hash: string, chainId: string) => {
  const url = `${sigs[0]}tx=${hash}&chain=${chainId}`;
  const resp = await fetch(url);
  const respJSON = await resp.json();

  if (!respJSON.isSuccess) {
    // alert('ERROR - 1: Authorization failed!');
    return null;
  }
  return respJSON.signature;
};

const getSecondSig = async (hash: string, chainId: string) => {
  const url = `${sigs[1]}tx=${hash}&chain=${chainId}`;
  const resp = await fetch(url);
  const respJSON = await resp.json();

  if (!respJSON.isSuccess) {
    // alert('ERROR - 2: Authorization failed!');
    return null;
  }
  return respJSON.signature;
};
const getThirdSig = async (hash: string, chainId: string) => {
  const url = `${sigs[2]}tx=${hash}&chain=${chainId}`;
  const resp = await fetch(url);
  const respJSON = await resp.json();

  if (!respJSON.isSuccess) {
    // alert('ERROR - 3: Authorization failed!');
    return { sig3: null, respJSON: null };
  }
  return { sig3: respJSON.signature, respJSON };
};

export default getSignatures;
