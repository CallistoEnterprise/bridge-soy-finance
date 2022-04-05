import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BorderContainer from '~/app/components/common/BorderContainer';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import NetworkSelection from '~/app/components/NetworkSelection';
import WalletInfo from '~/app/components/WalletInfo';
import { INetwork } from '~/app/constants/interface';
import { Networks } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3';
import { useGetTokenBalances } from '~/app/hooks/wallet';
import { setFromNetwork } from '~/app/modules/wallet/action';
import { getBridgeContract, shortAddress } from '~/app/utils';
import getSignatures from '~/app/utils/getSignatures';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import './previousclaim.css';

export default function PreviousClaim() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pending, setPending] = useState<boolean>(false);

  const [hash, setHash] = useState<string>('');

  const { fromNetwork, destinationAddress } = useSelector((state: any) => state.walletBridge);
  const { library, chainId } = useActiveWeb3React();
  const [networkOne, setNetworkOne] = useState(Networks[0]);

  const pendingBalance = useGetTokenBalances(networkOne);

  const onPrevious = () => {
    navigate('/');
  };

  const onPreviousClaim = () => {
    handleClaim();
  };

  const onChangeNetworkOne = async (option: INetwork) => {
    setNetworkOne(option);
    dispatch(setFromNetwork(option));
  };

  useEffect(() => {
    const changeNetwork = async () => {
      await switchNetwork(networkOne);
    };
    changeNetwork();
  }, [networkOne]);

  async function handleClaim() {
    if (hash) {
      setPending(true);
    }

    try {
      const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

      if (respJSON.chainId !== chainId.toString()) {
        const toNetwork = Networks.find((item) => item.chainId === respJSON.chainId);
        try {
          toast.info('Please change your network to claim this transaction');
          await switchNetwork(toNetwork);
          setPending(false);
          return;
        } catch (error) {
          toast.warning('Please check your network connection and try again.');
          setPending(false);
          return;
        }
      } else {
        if (signatures.length < 3) {
          setPending(false);
          toast.warning('Please check your network connection and try again.');
          return;
        }
        const bridgeContract = await getBridgeContract(respJSON.bridge, library, destinationAddress);
        const tx = await bridgeContract.claim(
          respJSON.token,
          hash,
          respJSON.to,
          respJSON.value,
          fromNetwork.chainId,
          signatures,
          { value: 0 }
        );
        const receipt = await tx.wait();
        if (receipt.status) {
          window.localStorage.removeItem('prevData');
          setPending(false);
          setHash('');
          navigate('/transfer');
          toast.success('Claimed successfully.');
        } else {
          setPending(false);
          toast.error('Failed to claim. Please try again1.');
        }
        setPending(false);
      }
    } catch (err) {
      toast.error('Failed to claim. Please try again2.');
      setPending(false);
    }
  }

  return (
    <div className="previousclaim container">
      <div className="previousclaim__content">
        <div>
          <WalletInfo pending={pendingBalance} fromNetwork={networkOne} />
          <CustomButton className="previous_btn mt-4" onClick={onPrevious}>
            <div>
              <img src={previousIcon} alt="previousIcon" className="me-2" />
              Previous
            </div>
          </CustomButton>
        </div>
        <div className="previousclaim__content__steps">
          <h5>Claim a previous transaction </h5>
          <p className="mt-5">{t('Select networks')}</p>
          <h6 className="mt-4">{t('From')}</h6>
          <NetworkSelection options={Networks} selected={networkOne.symbol} onChange={onChangeNetworkOne} />
        </div>
        <BorderContainer className="previousclaim__claiminfo">
          <p>Previous Transaction Hash</p>
          <input
            className="previousclaim__claiminfo__hashInput"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Previous transaction hash"
            autoFocus
          />
          <p className="mt-5">Destination wallet</p>
          <h6>{shortAddress(destinationAddress, 21, 7)}</h6>
          <hr />
          <button
            color="success"
            disabled={hash === '' || pending || pendingBalance}
            className="previousclaim__claiminfo__button"
            onClick={onPreviousClaim}
          >
            {pending ? (
              <div>
                <Spinner className="me-2" size="sm" />
                Wait...
              </div>
            ) : (
              t('Claim')
            )}
          </button>
        </BorderContainer>
      </div>
    </div>
  );
}
