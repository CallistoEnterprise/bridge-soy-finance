import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BorderContainer from '~/app/components/common/BorderContainer';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import NetworkSelection from '~/app/components/NetworkSelection';
import WalletInfo from '~/app/components/WalletInfo';
import { MIN_GAS_AMOUNT } from '~/app/constants';
import { INetwork } from '~/app/constants/interface';
import { Networks, NetworksObj } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useGetWeb3 from '~/app/hooks/useGetWeb3';
import useToast from '~/app/hooks/useToast';
import { useGetBTTBalance, useGetCLOBalance1, useGetTokenBalances, useNativeETHBalance } from '~/app/hooks/wallet';
import { setFromNetwork } from '~/app/modules/wallet/action';
import { getBridgeContract, shortAddress } from '~/app/utils';
import { submitClaimAction } from '~/app/utils/apiHelper';
import getSignatures from '~/app/utils/getSignatures';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import './previousclaim.css';

export default function PreviousClaim() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pending, setPending] = useState<boolean>(false);
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [hash, setHash] = useState<string>('');

  const { fromNetwork } = useSelector((state: any) => state.walletBridge);
  const web3 = useGetWeb3(fromNetwork?.rpcs[0]);

  const { library, chainId, account } = useActiveWeb3React();
  const [networkOne, setNetworkOne] = useState(NetworksObj[chainId ?? 820]);

  const pendingBalance = useGetTokenBalances(NetworksObj[chainId ?? 820]);
  const { toastError, toastWarning, toastInfo, toastSuccess } = useToast();

  const cloBalance = useGetCLOBalance1();
  const bttBalance = useGetBTTBalance();

  const nativeCoinBalance = useNativeETHBalance();

  useEffect(() => {
    const get = async () => {
      web3.eth
        .getTransaction(hash)
        .then((response: any) => {
          if (response) {
            if (response.input.substring(0, 10) === '0x487cda0d') {
              const reciever = `0x${response.input.substring(34, 74)}`;
              //console.log(reciever);
              setDestinationAddress(reciever);
            }
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };
    if (web3 && hash !== '') {
      get();
    }
  }, [web3, hash]);

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

  async function getSig3() {
    let sig;
    for (let i = 0; i < 4; i++) {
      sig = await getSignatures(hash, fromNetwork.chainId);
      if (sig.signatures.length >= 3) {
        return sig;
      }
    }
    return sig;
  }

  async function handleClaim() {
    try {
      const { signatures, respJSON } = await getSig3();
      if (signatures.length < 3) {
        setPending(false);
        toastWarning(
          'Warning!',
          'Failed to get the signatures. Please check the network connection or select the correct network.'
        );
        return;
      }
      if (respJSON.chainId !== chainId.toString()) {
        const toNetwork = Networks.find((item) => item.chainId === respJSON.chainId);
        try {
          toastInfo('Info!', 'Please change your network to claim this transaction');
          await switchNetwork(toNetwork, library);
          setPending(false);
          return;
        } catch (error) {
          toastWarning('Warning!', 'Please check your network connection and try again.');
          setPending(false);
          return;
        }
      } else {
        if (nativeCoinBalance < 0.005 && chainId !== 820) {
          toastWarning('Warning!', 'Insufficient gas in wallet.');
          return;
        }
        if (nativeCoinBalance < 0.005 && chainId !== 199) {
          toastWarning('Warning!', 'Insufficient gas in wallet.');
          return;
        }
        if (hash) {
          setPending(true);
        } else {
          return;
        }
        if (
          (cloBalance < MIN_GAS_AMOUNT[820] && chainId === 820) ||
          (bttBalance < MIN_GAS_AMOUNT[199] && chainId === 199)
        ) {
          submitClaimAction(hash, fromNetwork.chainId)
            .then((res: any) => {
              if (res?.isSuccess) {
                setPending(false);
                window.localStorage.removeItem('prevData');
                navigate('/transfer');
                setHash('');
                toastSuccess(t('Claimed successfully.'));
              } else {
                toastError(`Failed to claim. ${res.message}`);
                setPending(false);
                setHash('');
              }
            })
            .catch((err) => {
              toastError(t('Failed to claim. Please try again.'));
              setPending(false);
              setHash('');
            });
        } else {
          // const dest = destinationAddress === '' ? account : destinationAddress;
          const bridgeContract = await getBridgeContract(respJSON.bridge, library, account);

          let tx;
          if (respJSON.data && respJSON.toContract) {
            const gasLimit = await bridgeContract.estimateGas.claimToContract(
              respJSON.token,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              respJSON.toContract,
              respJSON.data,
              signatures,
              {
                value: 0
              }
            );

            tx = await bridgeContract.claimToContract(
              respJSON.token,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              respJSON.toContract,
              respJSON.data,
              signatures,
              {
                value: 0,
                gasLimit: gasLimit.add(20000)
              }
            );
          } else {
            const gasLimit = await bridgeContract.estimateGas.claim(
              respJSON.token,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              signatures,
              { value: 0 }
            );

            tx = await bridgeContract.claim(
              respJSON.token,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              signatures,
              { value: 0, gasLimit: gasLimit.add(20000) }
            );
          }

          const receipt = await tx.wait();
          if (receipt.status) {
            window.localStorage.removeItem('prevData');
            setPending(false);
            setHash('');
            navigate('/transfer');
            toastSuccess(t('Success!'), t('Claimed successfully.'));
          } else {
            setPending(false);
            toastError(t('Error!'), t('Failed to claim. Please try again.'));
          }
          setPending(false);
        }
      }
    } catch (err) {
      toastError(t('Error!'), t('Failed to claim. Please try again.'));
      setPending(false);
    }
  }

  return (
    <div className="previousclaim container">
      <div className="previousclaim__content">
        <div>
          <WalletInfo pending={pendingBalance} fromNetwork={NetworksObj[chainId ?? 820]} />
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
                {t(`Wait...`)}
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
