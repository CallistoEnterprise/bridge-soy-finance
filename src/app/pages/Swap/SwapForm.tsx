import { useWeb3React } from '@web3-react/core';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import CustomCheckbox from '~/app/components/common/CustomCheckbox';
import FormInput from '~/app/components/common/FormInput';
import Spinner from '~/app/components/common/Spinner';
import { useGetAmountsInput, useGetAmountsOut } from '~/app/hooks/useGetAmountsOut';
import useToast from '~/app/hooks/useToast';
import { useGetCLOBalance } from '~/app/hooks/wallet';
// import { FieldInput } from '~/app/modules/swap/action';
// import { useSwapActionHandlers } from '~/app/modules/swap/hooks';
// import useGetSwapState, { useDerivedSwapInfo, useSwapActionHandlers } from '~/app/modules/swap/hooks';
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
  setBuyCLO: () => void;
};

const registerSchema = Yup.object().shape({
  swap_amount: Yup.number()
    .typeError('Amount must be a number')
    .required('Please provide swap amount.')
    .min(0, 'Too little')
  // buy_amount: Yup.number()
  //   .typeError('Amount must be a number')
  //   .required('Please provide buy amount.')
  //   .min(0, 'Too little'),
  // destination_wallet: Yup.string()
  //   .min(2, `buy_amount has to be at least 2 characters`)
  //   .required('buy_amount is required')
});

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export default function SwapForm({ submit, initialData, pending, canBuyCLO, setBuyCLO, disable, tokenBalance }: props) {
  const [t] = useTranslation();
  // const dispatch = useDispatch();

  const [destination, setDestination] = useState(false);
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
    setSwapAmount(tokenBalance.toString());
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
                        <label htmlFor="swap_amount">{t('Amount to swap')} </label>
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
                  {!disable && (
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
                            groupname="CLO"
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
                      t('SWAP')
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
