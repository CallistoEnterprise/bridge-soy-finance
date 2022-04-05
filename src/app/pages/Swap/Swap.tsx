import BigNumber from 'bignumber.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import BorderContainer from '~/app/components/common/BorderContainer';
import CustomButton from '~/app/components/common/CustomButton';
import Notice from '~/app/components/Notice';
import WalletInfo from '~/app/components/WalletInfo';
import { blockConfirmations } from '~/app/constants/config';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3';
import useCurrentBlockTimestamp from '~/app/hooks/useCurrentBlockTimestamp';
import useGetAllowance from '~/app/hooks/useGetAllowance';
import useGetWeb3 from '~/app/hooks/useGetWeb3';
import useSwap from '~/app/hooks/useSwap';
import useToast from '~/app/hooks/useToast';
import {
  setConfirmedBlockCounts,
  setDestinationAddress,
  setHash,
  setStartSwapping,
  setSwapType
} from '~/app/modules/wallet/action';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { getDecimalAmount } from '~/app/utils/decimal';
import getEncodedData from '~/app/utils/getEncodedData';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import Claim from './Claim';
import './swap.css';
import SwapForm from './SwapForm';

const Swap = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [succeed, setSucced] = useState(false);
  const [canBuyCLO, setCanBuyCLO] = useState(false);
  const [txBlockNumber, setTxBlockNumber] = useState(0);
  const [switched, setSwitched] = useState(false);

  const { balance, selectedToken, fromNetwork, toNetwork } = useGetWalletState();
  const swapTokenAddr = selectedToken?.address[`${fromNetwork.chainId}`];
  const swapTokenAddrInCallisto = selectedToken?.address[820];

  const { onApprove, allowed } = useGetAllowance(swapTokenAddr);
  const { onAdvancedSwap, onSimpleSwap } = useSwap();
  const web3 = useGetWeb3(fromNetwork?.rpcs[0]);
  const deadline = useCurrentBlockTimestamp();

  const [claimAddress, setClaimAddress] = useState('');
  const { account, chainId } = useActiveWeb3React();
  const { toastError, toastWarning } = useToast();

  const disable = fromNetwork?.symbol === 'CLO' || toNetwork?.symbol !== 'CLO';

  const onPrevious = () => {
    navigate('/tokens');
  };

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  useEffect(() => {
    const getCurrentBlock = () => {
      const timer = setInterval(async () => {
        const b = await web3.eth.getBlockNumber();
        if (b - txBlockNumber >= blockConfirmations[chainId]) {
          clearInterval(timer);
          setSucced(true);
          setPending(false);
          dispatch(setStartSwapping(false));
          await switchNetwork(toNetwork);
          setSwitched(true);
          setTxBlockNumber(0);
          dispatch(setConfirmedBlockCounts(0));
        } else {
          dispatch(setConfirmedBlockCounts(b - txBlockNumber));
        }
      }, 1000);
    };
    if (txBlockNumber !== 0 && pending) {
      getCurrentBlock();
    }
  }, [dispatch, txBlockNumber, pending, chainId, toNetwork, web3]);

  const onSubmit = (values: any) => {
    const tokenBalance = balance[`${selectedToken.symbol}`];
    if (Number(values.swap_amount) > Number(tokenBalance)) {
      toastWarning('WARNING!', 'Inssuficient token balance!');
      return;
    }
    if (canBuyCLO) {
      advancedSwap(
        values.swap_amount,
        values.destination_wallet,
        values.buy_amount,
        values.amountsIn,
        values.amountsOut
      );
      dispatch(setSwapType('advanced-swap'));
    } else {
      onClickSwap(values.swap_amount, values.destination_wallet);
      dispatch(setSwapType('swap'));
    }
  };

  async function advancedSwap(
    amount: any,
    distinationAddress: string,
    buy_amount: any,
    amountsIn: any,
    amountsOut: any
  ) {
    setPending(true);
    const address: any = distinationAddress === '' ? account : distinationAddress;
    setClaimAddress(address);

    const bigAmount = getDecimalAmount(
      new BigNumber(amount.toString()),
      selectedToken.decimals[`${fromNetwork.symbol}`]
    );
    const buyBigAmount = getDecimalAmount(
      new BigNumber(buy_amount.toString()),
      selectedToken.decimals[`${toNetwork.symbol}`]
    );

    let value = '0';
    if (swapTokenAddr.slice(0, -2) === '0x00000000000000000000000000000000000000') {
      value = bigAmount.toString();
    } else {
      if (!allowed) {
        await onApprove();
      }
    }

    try {
      const maxAmountsIn = Math.floor(1.05 * Number(amountsIn));
      const byte_data = await getEncodedData(web3, [
        buyBigAmount,
        new BigNumber(maxAmountsIn),
        [swapTokenAddrInCallisto, '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a'],
        distinationAddress,
        new BigNumber(deadline)
      ]);

      try {
        const tx = await onAdvancedSwap(address, swapTokenAddr, bigAmount, toNetwork.chainId, byte_data, value);
        if (tx.hash) {
          await handleSetPending(tx.hash, address);
        }
      } catch (error) {
        setPending(false);
        setSucced(false);
        dispatch(setStartSwapping(false));
      }
    } catch (error) {
      console.log(error);
      setPending(false);
      setSucced(false);
      dispatch(setStartSwapping(false));
    }
  }

  async function onClickSwap(amount: any, distinationAddress: string) {
    setPending(true);
    const address: any = distinationAddress === '' ? account : distinationAddress;
    setClaimAddress(address);

    const bigAmount = getDecimalAmount(
      new BigNumber(amount.toString()),
      selectedToken.decimals[`${fromNetwork.symbol}`]
    );

    if (swapTokenAddr === '') {
      toastError('Please select another asset. Current asset is not supported yet!');
    } else {
      let value = '0';
      if (swapTokenAddr.slice(0, -2) === '0x00000000000000000000000000000000000000') {
        value = bigAmount.toString();
      } else {
        if (!allowed) {
          await onApprove();
        }
      }

      try {
        const tx = await onSimpleSwap(address, swapTokenAddr, bigAmount, toNetwork.chainId, value);
        if (tx.hash) {
          await handleSetPending(tx.hash, address);
        }
      } catch (error) {
        setPending(false);
        setSucced(false);
        dispatch(setStartSwapping(false));
      }
    }
  }

  const handleSetPending = async (hash: string, toAddr: string) => {
    dispatch(setStartSwapping(true));
    const lastBlock = await web3.eth.getBlockNumber();
    setTxBlockNumber(lastBlock);
    dispatch(setHash(hash));
    dispatch(setDestinationAddress(toAddr));
  };

  const claim_address = useMemo(() => claimAddress, [claimAddress]);

  return (
    <>
      {pending || succeed ? (
        <Claim
          succeed={succeed}
          address={claim_address}
          totalBlockCounts={switched ? 1 : blockConfirmations[chainId]}
          web3={web3}
        />
      ) : (
        <div className="swap container">
          <div className="swap__content">
            <CustomButton className="previous_btn" onClick={onPrevious}>
              <div>
                <img src={previousIcon} alt="previousIcon" className="me-2" />
                {t('Previous')}
              </div>
            </CustomButton>
            <div className="swap__content--mainboard">
              <WalletInfo fromNetwork={fromNetwork} />
              <div className="swap__content__steps">
                <BorderContainer className="swap__content__bordercontainer">
                  <div>
                    <p className="swap__content--row">
                      <strong>{t('Step 4:')}</strong> {t('Swap')}
                    </p>
                    <SwapForm
                      submit={onSubmit}
                      pending={pending}
                      disable={disable}
                      canBuyCLO={canBuyCLO}
                      initialData={{ swap_amount: '0', buy_amount: '0', destination_wallet: account }}
                      setBuyCLO={() => setCanBuyCLO(!canBuyCLO)}
                    />
                  </div>
                </BorderContainer>
              </div>
            </div>
            {parseInt(balance.clo) === 0 && <Notice />}
          </div>
        </div>
      )}
    </>
  );
};

export default Swap;
