import { useWeb3React } from '@web3-react/core';
import { Field, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import CustomCheckbox from '~/app/components/common/CustomCheckbox';
import FormInput from '~/app/components/common/FormInput';
import Spinner from '~/app/components/common/Spinner';
import { useGetAmountsInput, useGetAmountsOut } from '~/app/hooks/useGetAmountsOut';
import useToast from '~/app/hooks/useToast';
import { useGetCLOBalance } from '~/app/hooks/wallet';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { escapeRegExp } from '~/app/utils';
import { getBalanceAmount } from '~/app/utils/decimal';
import SwapFooter from './SwapFooter';
import './swapform.css';

type props = {
  submit?: (data: any) => void;
  state?: any;
  disable?: boolean;
  tokenBalance?: number;
  initialData?: any;
  pending: boolean;
  canBuyCLO: boolean;
  inputCurrency: any;
  outputCurrency: any;
  setBuyCLO: () => void;
};

const registerSchema = Yup.object().shape({
  swap_amount: Yup.number()
    .typeError('Amount must be a number')
    .required('Please provide swap amount.')
    .min(0, 'Too little')
});

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export default function SwapForm({
  submit,
  initialData,
  pending,
  canBuyCLO,
  setBuyCLO,
  disable,
  tokenBalance,
  inputCurrency,
  outputCurrency
}: props) {
  const [t] = useTranslation();

  const [destination, setDestination] = useState(true);
  const { chainId } = useWeb3React();

  const { selectedToken, fromNetwork, toNetwork } = useGetWalletState();
  const cloBalance = useGetCLOBalance(fromNetwork);
  const [swap_amount, setSwapAmount] = useState('');
  const [buy_amount, setBuyAmount] = useState('');

  const amountsOut = useGetAmountsOut(swap_amount);
  const amountsIn = useGetAmountsInput(buy_amount);
  const { toastError } = useToast();

  const intInputAmount = swap_amount === '' ? 0 : parseFloat(swap_amount);
  const intOutputAmount = buy_amount === '' ? 0 : parseFloat(buy_amount);

  const receiveOriginAmount = intInputAmount - getBalanceAmount(amountsIn).toNumber();
  const fullOutAmount = getBalanceAmount(amountsOut, selectedToken?.decimals[`${toNetwork.chainId}`]).toNumber();
  // const parsedAmount = tryParseAmount(buy_amount, outputCurrency ?? undefined);

  // const bestTradeExactOut = useTradeExactOut(
  //   inputCurrency ?? undefined,
  //   parsedAmount ?? undefined,
  //   Number(toNetwork.chainId)
  // );

  // console.log(inputCurrency, bestTradeExactOut, parsedAmount);
  const onChangeDestination = (status: boolean) => {
    setDestination(status);
  };

  const onSubmit = (values: any) => {
    submit({
      ...values,
      swap_amount,
      buy_amount,
      amountsIn,
      amountsOut
    });
  };

  const handleSwapAmount = (e: any) => {
    const temp = e.target.value.replace(/,/g, '.');
    if (temp === '' || inputRegex.test(escapeRegExp(temp))) {
      setSwapAmount(temp);
    }
  };

  const handleBuyAmount = (e: any) => {
    const temp = e.target.value.replace(/,/g, '.');
    if (parseFloat(temp) > fullOutAmount) {
      toastError(`You can buy CLO less than ${fullOutAmount}`);
      setBuyAmount(fullOutAmount.toString());
      return;
    }
    if (temp === '' || inputRegex.test(escapeRegExp(temp))) {
      setBuyAmount(temp);
    }
  };

  const handleMaxInput = () => {
    selectedToken.symbol === fromNetwork.symbol
      ? setSwapAmount((Number(tokenBalance) - 0.005).toString())
      : setSwapAmount((Number(tokenBalance) - 0.0000001).toString());
  };

  return (
    <div className="swapform">
      <Formik
        initialValues={
          initialData ?? {
            swap_amount: '0',
            buy_amount: '0',
            destination_wallet: '1231231'
          }
        }
        validationSchema={registerSchema}
        validateOnMount
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values }) => {
          return (
            <form onSubmit={handleSubmit} noValidate name="swapForm">
              <div className="row">
                <div className="col">
                  <div className="row mt-3 swapform__row">
                    <div className="col">
                      <div className="justify-content-between swapform__label">
                        <label htmlFor="swap_amount">{t('Amount to transfer')} </label>
                        <div className="swapform__max-button" onClick={handleMaxInput}>
                          {t('MAX')}
                        </div>
                      </div>
                      <Field
                        name="swap_amount"
                        type="text"
                        groupname={selectedToken.symbol}
                        component={FormInput}
                        value={swap_amount}
                        inputMode="decimal"
                        autoComplete="off"
                        autoCorrect="off"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        minLength={1}
                        maxLength={79}
                        spellCheck="false"
                        onChange={handleSwapAmount}
                      />
                      <div className="d-flex justify-content-between">
                        <p className="swapform__subtext">{t('Amount')}</p>
                      </div>
                    </div>
                  </div>
                  {disable && (
                    <div className="row mt-4 swapform__row">
                      <div className="col">
                        <CustomCheckbox
                          label={t(`Buy ${toNetwork.chainId === '820' ? 'Callisto' : 'BitTorrent'} coin`)}
                          checked={canBuyCLO}
                          onChangeCheckbox={setBuyCLO}
                        />
                      </div>
                    </div>
                  )}
                  {canBuyCLO && (
                    <>
                      <div className="row mt-3 swapform__row">
                        <div className="col">
                          {/* <label htmlFor="buy_amount">Amount to swap </label> */}
                          <Field
                            name="buy_amount"
                            type={'text'}
                            groupname={toNetwork.chainId === '820' ? 'CLO' : 'BTT'}
                            component={FormInput}
                            value={buy_amount}
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            minLength={1}
                            maxLength={79}
                            spellCheck="false"
                            onChange={handleBuyAmount}
                          />
                          <SwapFooter
                            values={{
                              swap_amount: `${receiveOriginAmount} ${selectedToken?.symbol}`,
                              buy_amount: `${intOutputAmount}`
                            }}
                            toNetwork={toNetwork}
                          />
                        </div>
                      </div>
                      <div className="row mt-4 swapform__row">
                        <p className="swapform__description">
                          <i>{t('The value will be deducted from your swap. No fees are applied.')}</i>
                        </p>
                      </div>
                    </>
                  )}

                  <div className="row mt-5 swapform__row">
                    <div className="col">
                      <CustomCheckbox
                        label={t('Specific destination wallet')}
                        checked={destination}
                        onChangeCheckbox={onChangeDestination}
                      />
                    </div>
                  </div>

                  <div className="row mt-3 swapform__row">
                    <div className="col">
                      {destination && (
                        <Field
                          name="destination_wallet"
                          className="form-control swapform__destinationinput"
                          type={'text'}
                          component={FormInput}
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    color="success"
                    className="swapform__submit"
                    disabled={
                      swap_amount === '0' ||
                      swap_amount === '' ||
                      values.destination_wallet === '' ||
                      pending ||
                      (cloBalance === 0 && chainId === 820)
                    }
                  >
                    {pending ? (
                      <div>
                        <Spinner className="me-2" size="sm" />
                        Wait...
                      </div>
                    ) : (
                      t('TRANSFER')
                    )}
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
