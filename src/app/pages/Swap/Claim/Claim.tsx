import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import { MIN_GAS_AMOUNT } from '~/app/constants';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useClaim from '~/app/hooks/useClaim';
import useToast from '~/app/hooks/useToast';
import { useGetCLOBalance } from '~/app/hooks/wallet';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { submitClaimAction } from '~/app/utils/apiHelper';
import getSignatures from '~/app/utils/getSignatures';
import claimAnimal from '~/assets/images/animal.gif';
import './claim.css';

type props = {
  succeed: boolean;
  address?: string;
  confirmedCounts?: number;
  totalBlockCounts?: number;
  web3?: any;
};

export default function Claim({ succeed, totalBlockCounts }: props) {
  const [t] = useTranslation();
  const { chainId } = useActiveWeb3React();
  const navigate = useNavigate();

  const [pending, setPending] = useState(false);

  const { hash, fromNetwork, swapType, toNetwork } = useGetWalletState();
  const cloBalance = useGetCLOBalance(toNetwork);
  const { onSimpleClaim, onAdvancedClaim } = useClaim();
  const { toastError, toastSuccess } = useToast();

  const onClaim = async () => {
    if (hash === '') {
      return;
    }
    setPending(true);
    const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

    if (signatures.length < 3) {
      setPending(false);
      toastError('Failed to get signature.');
      return;
    }

    if (respJSON.chainId !== chainId.toString()) {
      toastError(`You are in wrong network. Please switch to ${toNetwork.name}.`);
      setPending(false);
      return;
    }

    if (
      (cloBalance < MIN_GAS_AMOUNT[820] && chainId === 820) ||
      (cloBalance < MIN_GAS_AMOUNT[199] && chainId === 199)
    ) {
      submitClaimAction(hash, fromNetwork.chainId)
        .then((res: any) => {
          if (res?.isSuccess) {
            setPending(false);
            window.localStorage.removeItem('prevData');
            navigate('/transfer');
            toastSuccess('Claimed successfully.');
          } else {
            toastError(`Failed to claim. ${res.message}`);
            setPending(false);
          }
        })
        .catch((err) => {
          toastError('Failed to claim. Please try again.');
          setPending(false);
        });
    } else {
      if (swapType === 'swap') handleClaim(signatures, respJSON);
      else if (swapType === 'advanced-swap') handleAdvancedClaim(signatures, respJSON);
    }
  };

  async function handleAdvancedClaim(signatures: any, respJSON: any) {
    setPending(true);
    try {
      // const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

      // if (signatures.length < 3) {
      //   setPending(false);
      //   toastError('Failed to get signature.');
      //   return;
      // }
      try {
        const receipt = await onAdvancedClaim(respJSON, hash, fromNetwork.chainId, signatures);
        if (receipt.status) {
          // await handleSetPending();
          setPending(false);
          window.localStorage.removeItem('prevData');
          navigate('/transfer');
          toastSuccess('Claimed successfully.');
        } else {
          setPending(false);
        }
      } catch (error) {
        setPending(false);
        toastError('Failed to claim. Please try again.');
      }
    } catch (err) {
      setPending(false);
      toastError('Failed to get signature. Please try again.');
    }
  }

  async function handleClaim(signatures: any, respJSON: any) {
    setPending(true);

    try {
      // const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);
      // if (signatures.length < 3) {
      //   setPending(false);
      //   toastError('Invalid signature.');
      //   return;
      // }
      const receipt = await onSimpleClaim(respJSON, hash, fromNetwork.chainId, signatures);
      if (receipt.status) {
        // await handleSetPending();
        setPending(false);
        window.localStorage.removeItem('prevData');
        navigate('/transfer');
        toastSuccess('Claimed successfully.');
      } else {
        setPending(false);
      }
    } catch (err) {
      toastError('Failed to get signature. Please try again.');
      setPending(false);
    }
  }

  // const handleGetFreeCLO = () => {
  //   window.open(faucetLink, '_blank');
  // };

  return (
    <div className="claim container">
      <div className="claim__content">
        <div className="claim__content--blockbox">
          <img src={claimAnimal} className="claim__content__animal" alt="claimAnimal" />
        </div>
        <div className="claim__content--text">
          <h4>{succeed ? t('Transfer is done!') : t('Transfer is in progress')}</h4>
          <p>
            {t(
              `Please wait for ${totalBlockCounts} ${
                totalBlockCounts === 1 ? 'block confirmation' : 'block confirmations'
              } to claim your transaction.`
            )}
          </p>
          {(cloBalance < MIN_GAS_AMOUNT[820] || cloBalance < MIN_GAS_AMOUNT[199]) &&
            chainId === Number(toNetwork.chainId) &&
            pending && <p>{t(`Please wait, we are claiming for you...`)}</p>}

          {succeed && (
            <CustomButton className="claim__claimbtn" disabled={pending} onClick={onClaim}>
              {pending ? (
                <div>
                  <Spinner className="me-2" size="sm" />
                  Wait...
                </div>
              ) : (
                t('Claim')
              )}
            </CustomButton>
          )}
          {/* {succeed && cloBalance === 0 && Number(toNetwork.chainId) === 820 && (
            <CustomButton className="claim__getclo" onClick={handleGetFreeCLO}>
              {t('Get CLO')}
            </CustomButton>
          )} */}
        </div>
      </div>
    </div>
  );
}
