import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import BorderContainer from '~/app/components/common/BorderContainer';
import Spinner from '~/app/components/common/Spinner';
import defaultTokens from '~/app/constants/tokenLists/tokenLists2.json';
import { AppState } from '~/app/core/store';
import useAuth from '~/app/hooks/useAuth';
import copyIcon from '~/assets/images/copy.svg';
import metamaskIcon from '~/assets/images/metamask.svg';
import './walletinfo.css';

type walletInfoProps = {
  pending?: boolean;
  fromNetwork?: any;
};

export default function WalletInfo({ pending, fromNetwork }: walletInfoProps) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const { account, active } = useWeb3React();

  const tokenList = useMemo(() => {
    return defaultTokens.tokens.filter((token: any) => token.address[`${fromNetwork.chainId}`] !== '');
  }, [fromNetwork.chainId]);

  const { logout } = useAuth();
  const accountEllipsis = account ? `${account.substring(0, 8)}...${account.substring(account.length - 4)}` : null;

  const { balance } = useSelector((state: AppState) => state.walletBridge);
  const balanceLen = Object.keys(balance).length;

  useEffect(() => {
    if (!active) {
      navigate('/');
    }
  }, [active, navigate]);

  const onClickDisconnect = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {!isMobile ? (
        <BorderContainer className="walletinfo__balance">
          <div>
            <img src={metamaskIcon} alt="metamaskIcon" />
            <div className="d-flex">
              <p className="me-1">{accountEllipsis}</p>
              <img src={copyIcon} alt="copyIcon" />
            </div>
            <p className="walletinfo__balance--title">{t('Balance')}</p>
            {pending || tokenList.length !== balanceLen ? (
              <Spinner className="mt-5" size="sm" />
            ) : (
              <div className="tokens_container">
                {tokenList.map((item) => {
                  if (balance[`${item.symbol}`] === undefined) return null;
                  return (
                    <li className="tokenitem" key={item.logoURI}>
                      <div className="d-flex align-items-center">
                        <img className="me-2 token-icon" src={item.logoURI} alt="icon" />
                        <p className="ms-2">{`${balance[`${item.symbol}`]}`}</p>
                      </div>
                      <p style={{ marginRight: 10 }}>{item.symbol}</p>
                    </li>
                  );
                })}
              </div>
            )}

            <hr className="solid mt-5"></hr>
            <p className="walletinfo__balance--disconnect" onClick={onClickDisconnect}>
              {t('Disconnect')}
            </p>
          </div>
        </BorderContainer>
      ) : (
        <div className="walletinfo__balance d-flex align-items-center justify-content-center">
          <div>
            <img src={metamaskIcon} alt="metamaskIcon" />
          </div>
          <div className="ms-4">
            <div className="d-flex">
              <p className="me-1">{accountEllipsis}</p>
              <img src={copyIcon} alt="copyIcon" />
            </div>
            <hr className="solid"></hr>
            <p className="walletinfo__balance--disconnect" onClick={onClickDisconnect}>
              {t('Disconnect')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
