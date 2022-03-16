import classNames from 'classnames';
import React from 'react';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
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
