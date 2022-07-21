import classNames from 'classnames';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
import { getTokenLogoLink } from '~/app/utils/getImageUrl';
import './tokenselection.css';

type props = {
  options: Array<any>;
  fromNetwork?: any;
  onChange?: (option: any) => void;
  className?: string;
};

export default function TokenSelection({ options, fromNetwork, className, onChange }: props) {
  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)} onChange={onChange}>
        {options.map((option, index) => (
          <Radio
            key={`${option.address}-${index}`}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': isSelected
                })}
              >
                <div>
                  <img
                    className="tokenselection-logo"
                    src={
                      option.symbol === 'BUSDT' && fromNetwork.chainId !== '820' ? 'images/usdt.png' : option.logoURI
                    }
                    alt="icon"
                  />
                  {option.symbol === 'BUSDT' ? (fromNetwork.chainId === '820' ? 'BUSDT' : 'USDT') : option.symbol}
                </div>
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export const TokenSelection2 = ({ options, fromNetwork, className, onChange }: props) => {
  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)}>
        {options.map((option, index) => (
          <Radio
            key={`${option.address}-${index}`}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': isSelected
                })}
                onClick={() => onChange(option)}
              >
                <div>
                  <img
                    className="tokenselection-logo"
                    src={
                      option.symbol === 'BUSDT' && fromNetwork.chainId !== '820'
                        ? 'images/usdt.png'
                        : getTokenLogoLink(option.address, option.chainId)
                    }
                    alt="icon"
                  />
                  {option.symbol === 'BUSDT' ? (fromNetwork.chainId === '820' ? 'BUSDT' : 'USDT') : option.symbol}
                </div>
                {`(${option.network})`}
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
