import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomButton from '~/app/components/common/CustomButton';
import { TokenSelection2 } from '~/app/components/TokenSelection/TokenSelection';
import { addTokenList } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3';
import { registerToken } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import './transfer.css';

const Mobile = ({ children }: any) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

export default function Transfer() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { account, chainId } = useActiveWeb3React();
  // const [networkOne, setNetworkOne] = useState(null);

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  const onSelectToken = (option: any) => {
    // setNetworkOne(option.value);
    if (option.chainId !== chainId) {
      toast.warning(`Please switch network to ${option.network}`);
      return;
    }
    registerToken(option.address, option.symbol, 18);
  };

  const onPrevious = () => {
    navigate('/');
  };

  return (
    <div className="transfer container">
      <div className="transfer__content">
        <CustomButton className="previous_btn" onClick={onPrevious}>
          <div>
            <img src={previousIcon} alt="previousIcon" className="me-2" />
            {t('Previous')}
          </div>
        </CustomButton>
        {/* <Default>
          <ClaimPet />
        </Default> */}

        <div className="transfer__content__steps">
          <h4>{t('Transfert complete!')}</h4>
          <h6 className="mt-5">{t('You don’t see your tokens?')}</h6>
          <h6 className="mt-3">{t('Just add your asset to your wallet by clicking on its icon!')}</h6>
          <TokenSelection2 options={addTokenList} onChange={onSelectToken} className="transfer__selection" />
        </div>
        <Mobile>
          <div className="transfer__mobile">
            <p>Lagging transaction?</p>
            <p>Stay zen and click here!</p>
            <button type="submit" color="success" className="transfer__mobile__submit">
              {t('SWAP')}
              {/* {isPending(state) ? 'Wait...' : 'Submit'} */}
            </button>
          </div>
        </Mobile>
      </div>
    </div>
  );
}
