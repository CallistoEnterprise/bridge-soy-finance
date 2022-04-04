import Blocks from 'eth-block-timestamp';
import { useEffect, useState } from 'react';

const ethereumInfura = 'https://mainnet.infura.io/v3/d819f1add1a34a60adab4df578e0e741';
const blocks = new Blocks(ethereumInfura);

export default function useCurrentBlockTimestamp(): number | undefined {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const getTimeStamp = async () => {
      const { timestamp } = await blocks.getDate('latest');
      setTime(timestamp);
    };
    getTimeStamp();
  }, []);

  return time;
}
