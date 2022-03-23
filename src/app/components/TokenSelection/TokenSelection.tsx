import classNames from 'classnames';
import React from 'react';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
import { getTokenLogoLink } from '~/app/utils/getImageUrl';
import './tokenselection.css';

type props = {
  options: Array<any>;
  onChange?: (option: any) => void;
  className?: string;
};

export default function TokenSelection({ options, className, onChange }: props) {
  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)} onChange={onChange}>
        {options.map((option) => (
          <Radio
            key={option.logoURI}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': isSelected
                })}
              >
                <div>
                  <img className="tokenselection-logo" src={option.logoURI} alt="icon" />
                  {option.symbol}
                </div>
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export const TokenSelection2 = ({ options, className, onChange }: props) => {
  console.log(options);
  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)} onChange={onChange}>
        {options.map((option) => (
          <Radio
            key={option.logoURI}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': isSelected
                })}
              >
                <div>
                  <img className="tokenselection-logo" src={getTokenLogoLink(option.address)} alt="icon" />
                  {option.symbol}
                </div>
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
