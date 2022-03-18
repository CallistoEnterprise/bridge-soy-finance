import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import arrowDown from '~/assets/images/arrowdown.svg';
import blockIcon from '~/assets/images/block.png';
import facebook from '~/assets/images/facebook.svg';
import medium from '~/assets/images/medium.svg';
import telegram from '~/assets/images/telegram.svg';
import twitter from '~/assets/images/twitter.svg';
import whiteLogo from '~/assets/images/white-logo.svg';
import { blockConfirmations } from '../constants/config';
import './footer.css';

const Mobile = ({ children }: any) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

const Default = ({ children }: any) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

export default function Footer() {
  const { chainId } = useActiveWeb3React();
  const [t] = useTranslation();
  const [soyFinance, setSoyFinance] = useState(false);
  const [documentList, setDocumentList] = useState(false);
  const [resourceslist, setResourcesList] = useState(false);

  const { start_swapping, confirmedBlockCounts } = useSelector((state: any) => state.walletBridge);

  const dispBNumber =
    !start_swapping && confirmedBlockCounts !== 0 ? blockConfirmations[chainId] : confirmedBlockCounts;

  return (
    <div className={classNames('footer', { footer__animation: start_swapping })}>
      {start_swapping && (
        <div className="footer__blockContent">
          <img src={blockIcon} alt="blockIcon" className="footer__blockIcon" />
          <p className="footer__blockNumber">block {dispBNumber}</p>
        </div>
      )}
      {/* <div> */}
      <div className="footer__content">
        <div>
          <img src={whiteLogo} alt="whitelogo" />
          <Default>
            <>
              <p className="footer__link">{t('All rights reserved by')}</p>
              <p className="footer__bold">{t('Callisto Enterprise')}</p>
            </>
          </Default>
        </div>

        {/* <div className="footer__content--center"> */}
        <div className="footer__center">
          <div
            className="footer__center__dropdown"
            onClick={() => {
              setSoyFinance(!soyFinance);
              setResourcesList(false);
              setDocumentList(false);
            }}
          >
            <p className="footer__bold">{t('Soy Finance')}</p>
            <Mobile>
              <img src={arrowDown} alt="arrowDown" />
            </Mobile>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: !soyFinance })}>
            <a
              className="footer__link"
              href="https://soy-finance.gitbook.io/soy-finance/miscellaneous/media-kit"
              target="_blank"
              rel="noreferrer"
            >
              {t('Media Kit')}
            </a>
            <a className="footer__link" href="https://bullsinvesting.club/" target="_blank" rel="noreferrer">
              {t('BUSDT Stablecoin')}
            </a>
          </div>
        </div>

        <div className="footer__center">
          <div
            className="footer__center__dropdown"
            onClick={() => {
              setResourcesList(!resourceslist);
              setDocumentList(false);
              setSoyFinance(false);
            }}
          >
            <p className="footer__bold">{t('Ressources')}</p>
            <Mobile>
              <img src={arrowDown} alt="arrowDown" />
            </Mobile>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: !resourceslist })}>
            <a className="footer__link" href="https://callistoenterprise.com/team" target="_blank" rel="noreferrer">
              {t('Team')}
            </a>
            <a className="footer__link" href="https://github.com/SoyFinance/" target="_blank" rel="noreferrer">
              {t('Github')}
            </a>
            <a className="footer__link" href="https://callisto.network/" target="_blank" rel="noreferrer">
              {t('Callisto Network')}
            </a>
            <a className="footer__link" href="https://callistoenterprise.com/" target="_blank" rel="noreferrer">
              {t('Callisto Enterprise')}
            </a>
          </div>
        </div>

        <div className="footer__center">
          <div
            className="footer__center__dropdown"
            onClick={() => {
              setDocumentList(!documentList);
              setResourcesList(false);
              setSoyFinance(false);
            }}
          >
            <p className="footer__bold">{t('Documentation')}</p>
            <Mobile>
              <img src={arrowDown} alt="arrowDown" />
            </Mobile>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: !documentList })}>
            <a
              className="footer__link"
              href="https://callisto.network/soy-finance-soy-security-audit/"
              target="_blank"
              rel="noreferrer"
            >
              {t('Platform Audit Report')}
            </a>
            <a className="footer__link" href="https://clo.click/SOY-Deck" target="_blank" rel="noreferrer">
              {t('Investor Deck')}
            </a>
            <a
              className="footer__link"
              href="https://soy-finance.medium.com/soy-finance-monetary-policy-vision-4f07a1b48372"
              target="_blank"
              rel="noreferrer"
            >
              {t('Monetary Policy')}
            </a>
            <a
              className="footer__link"
              href="https://callisto.network/erc223-token-standard/"
              target="_blank"
              rel="noreferrer"
            >
              {t('ERC 223 Token Standard')}
            </a>
          </div>
        </div>
        {/* </div> */}

        <div className="footer__socialmedia u-align-center">
          <p className="footer__bold">{t('Social Media')}</p>
          <div className="mt-3">
            <a href="https://t.me/Soy_Finance" target="_blank" rel="noreferrer">
              <img src={telegram} alt="telegram" />
            </a>
            <a href="https://twitter.com/Soy_Finance" target="_blank" rel="noreferrer">
              <img src={twitter} alt="twitter" />
            </a>
            <a href="https://www.facebook.com/Soy.Finance" target="_blank" rel="noreferrer">
              <img src={facebook} alt="facebook" />
            </a>
            <a href="https://soy-finance.gitbook.io/" target="_blank" rel="noreferrer">
              <img src={medium} alt="medium" />
            </a>
          </div>
        </div>
        <Mobile>
          <p className="footer__privacy">
            All rights reserved by <strong>Callisto Enterprise</strong>{' '}
          </p>
        </Mobile>
      </div>
      {/* </div> */}
    </div>
  );
}
