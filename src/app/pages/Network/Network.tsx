/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import GuidePet from '~/app/components/common/GuidePet';
import NetworkSelection from '~/app/components/NetworkSelection';
import WalletInfo from '~/app/components/WalletInfo';
import { INetwork } from '~/app/constants/interface';
import { Networks } from '~/app/constants/strings';
import { useGetTokenBalances } from '~/app/hooks/wallet';
import { setFromNetwork, setStartSwapping, setToNetwork } from '~/app/modules/wallet/action';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import './network.css';

const Default = ({ children }: any) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

export default function Network() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [networkOne, setNetworkOne] = useState(Networks[0]);
  const [networkTwo, setNetworkTwo] = useState<any>(null);

  const pendingBalance = useGetTokenBalances(networkOne);

  useEffect(() => {
    if (networkOne?.symbol === networkTwo?.symbol) {
      setNetworkTwo(null);
    }
  }, [networkOne, networkTwo]);

  useEffect(() => {
    const changeNetwork = async () => {
      await switchNetwork(networkOne);
    };
    changeNetwork();
  }, [networkOne]);

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  const onChangeNetworkOne = async (option: INetwork) => {
    dispatch(setFromNetwork(option));
    setNetworkOne(option);
  };

  const onChangeNetworkTwo = (option: INetwork) => {
    dispatch(setToNetwork(option));
    setNetworkTwo(option);
  };

  const onPrevious = () => {
    navigate('/');
  };

  const onNext = () => {
    if (networkOne !== null && networkTwo !== null) {
      navigate('/tokens');
    }
  };

  return (
    <div className="network container">
      <div className="network__content">
        <CustomButton className="previous_btn" onClick={onPrevious}>
          <div>
            <img src={previousIcon} alt="Icon" className="me-2" />
            Previous
          </div>
        </CustomButton>
        <Default>
          <GuidePet />
        </Default>
        <WalletInfo pending={pendingBalance} fromNetwork={networkOne} />
        <div className="network__content__steps">
          <p>
            <strong>{t('Step 1:')}</strong> {t('Select the origin network')}
          </p>
          <h6>{t('The network from which you want to send your assets.')}</h6>
          <NetworkSelection options={Networks} selected={networkOne.symbol} onChange={onChangeNetworkOne} />

          <p className="mt-5">
            <strong>{t('Step 2:')}</strong> {t('Select the destination network')}
          </p>
          <h6>{t('The network to which you want to send your assets.')}</h6>
          <NetworkSelection options={Networks} disabled={networkOne.symbol} onChange={onChangeNetworkTwo} />
          <CustomButton
            className="mt-5"
            onClick={onNext}
            disabled={networkOne === null || networkTwo === null || pendingBalance}
          >
            {t('Next')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
