import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Facebook from '~/app/components/Svg/Icons/Facebook';
// import Medium from '~/app/components/Svg/Icons/Medium';
import Gitbook from '~/app/components/Svg/Icons/Gitbook';
import Pulse from '~/app/components/Svg/Icons/Pulse';
import Redit from '~/app/components/Svg/Icons/Redit';
import Telegram from '~/app/components/Svg/Icons/Telegram';
import Twitter from '~/app/components/Svg/Icons/Twitter';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import blockIcon from '~/assets/images/block.png';
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
              <p className="footer__text">{t('All rights reserved by')}</p>
              <p className="footer__bold">{t('Callisto Enterprise')}</p>
            </>
          </Default>
        </div>

        <div className="footer__center">
          <div className="footer__center__dropdown">
            <p className="footer__bold">{t('Soy Finance')}</p>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: false })}>
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
          <div className="footer__center__dropdown">
            <p className="footer__bold">{t('Resources')}</p>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: false })}>
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
          <div className="footer__center__dropdown">
            <p className="footer__bold">{t('Documentation')}</p>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: false })}>
            <a
              className="footer__link"
              href="https://soy-finance.gitbook.io/soy-finance/soy-products/safety-on-yields/soy-finance-security-audit/"
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
              href="https://soy-finance.gitbook.io/soy-finance/soy-products/soy-token/monetary-policy-vision/"
              target="_blank"
              rel="noreferrer"
            >
              {t('Monetary Policy')}
            </a>
            <a
              className="footer__link"
              href="https://soy-finance.gitbook.io/soy-finance/soy-products/safety-on-yields/erc-223-token-standard/"
              target="_blank"
              rel="noreferrer"
            >
              {t('ERC 223 Token Standard')}
            </a>
          </div>
        </div>

        <div className="footer__socialmedia u-align-center">
          <div className="mt-3">
            <a href="https://t.me/Soy_Finance" target="_blank" rel="noreferrer">
              <Telegram alt="Telegram" />
            </a>
            <a href="https://twitter.com/Soy_Finance" target="_blank" rel="noreferrer">
              <Twitter alt="Twitter" />
            </a>
            <a href="https://www.reddit.com/Soy.Finance" target="_blank" rel="noreferrer">
              <Redit alt="Reddit" />
            </a>
            <a href="https://www.facebook.com/Soy.Finance" target="_blank" rel="noreferrer">
              <Facebook alt="Facebook" />
            </a>
            <a href="https://soy-finance.gitbook.io/" target="_blank" rel="noreferrer">
              <Gitbook alt="GitBook" />
            </a>
            <a href="https://defillama.com/protocol/soy-finance" target="_blank" rel="noreferrer">
              <Pulse width="38px" height="38px" alt="DefiLlama" />
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
