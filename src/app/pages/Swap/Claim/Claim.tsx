import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import useClaim from '~/app/hooks/useClaim';
import useToast from '~/app/hooks/useToast';
import useGetWalletState from '~/app/modules/wallet/hooks';
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
  const navigate = useNavigate();

  const [pending, setPending] = useState(false);

  const { hash, fromNetwork, swapType } = useGetWalletState();
  const { onSimpleClaim, onAdvancedClaim } = useClaim();
  const { toastError, toastSuccess } = useToast();

  const onClaim = () => {
    if (hash === '') {
      return;
    }
    if (swapType === 'swap') handleClaim();
    else if (swapType === 'advanced-swap') handleAdvancedClaim();
  };

  async function handleAdvancedClaim() {
    setPending(true);
    try {
      const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

      if (signatures.length < 3) {
        setPending(false);
        toastError('Failed to get signature.');
        return;
      }
      try {
        const receipt = await onAdvancedClaim(respJSON, hash, fromNetwork.chainId, signatures);
        if (receipt.status) {
          // await handleSetPending();
          setPending(false);
          window.localStorage.removeItem('prevData');
          setPending(false);
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

  async function handleClaim() {
    setPending(true);

    try {
      const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);
      if (signatures.length < 3) {
        setPending(false);
        toastError('Invalid signature.');
        return;
      }
      const receipt = await onSimpleClaim(respJSON, hash, fromNetwork.chainId, signatures);
      if (receipt.status) {
        // await handleSetPending();
        setPending(false);
        window.localStorage.removeItem('prevData');
        setPending(false);
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

  return (
    <div className="claim container">
      <div className="claim__content">
        <div className="claim__content--blockbox">
          <img src={claimAnimal} className="claim__content__animal" alt="claimAnimal" />
        </div>
        <div className="claim__content--text">
          <h4>{succeed ? t('Transfert done!') : t('Transfert in progress')}</h4>
          <p>
            {t(
              `Please wait for ${totalBlockCounts} ${
                totalBlockCounts === 1 ? 'block confirmation' : 'blocks confirmations'
              } to claim your transaction.`
            )}
          </p>
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
        </div>
      </div>
    </div>
  );
}
