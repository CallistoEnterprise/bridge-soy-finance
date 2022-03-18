import React from 'react';
import Svg from '../Svg';
import { SvgProps } from '../types';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 38 38" width="38" height="38" {...props}>
      <path
        d="M18.7837 1.97542e-08C15.0688 -0.000170319 11.4372 1.10128 8.34827 3.16506C5.25934 5.22883 2.85177 8.16225 1.43001 11.5943C0.00825348 15.0264 -0.363832 18.8031 0.36081 22.4466C1.08545 26.0902 2.87427 29.437 5.50106 32.064C8.12785 34.6909 11.4746 36.4798 15.1182 37.2047C18.7617 37.9295 22.5383 37.5575 25.9705 36.1359C29.4026 34.7143 32.3362 32.3069 34.4001 29.2181C36.464 26.1292 37.5656 22.4977 37.5656 18.7828C37.5652 13.8016 35.5862 9.0245 32.0641 5.50217C28.5419 1.97983 23.7649 0.000685142 18.7837 1.97542e-08V1.97542e-08ZM27.3599 14.6411C27.368 14.826 27.372 15.0117 27.372 15.1983C27.3834 16.8125 27.074 18.4129 26.4616 19.9065C25.8492 21.4 24.9462 22.757 23.8048 23.8986C22.6635 25.0402 21.3067 25.9435 19.8133 26.5562C18.3198 27.1689 16.7195 27.4787 15.1053 27.4676C12.7623 27.4697 10.4682 26.7973 8.49701 25.5306C8.83833 25.5706 9.18169 25.5904 9.52534 25.5901C11.4667 25.5931 13.3526 24.943 14.8797 23.7444C13.9801 23.7275 13.1083 23.4298 12.3863 22.893C11.6642 22.3563 11.128 21.6073 10.8525 20.7507C11.4987 20.8755 12.1649 20.8502 12.7998 20.6767C11.8239 20.4796 10.9463 19.951 10.3159 19.1806C9.68546 18.4101 9.34102 17.4452 9.34103 16.4497C9.34103 16.4299 9.34103 16.4127 9.34103 16.3946C9.93935 16.7279 10.6089 16.9128 11.2935 16.9337C10.3806 16.3242 9.73432 15.3895 9.4863 14.3202C9.23829 13.2509 9.40717 12.1272 9.95854 11.1781C11.0411 12.5099 12.3917 13.5992 13.9227 14.3752C15.4536 15.1512 17.1306 15.5966 18.8448 15.6823C18.6287 14.7578 18.7238 13.7878 19.1152 12.9228C19.5066 12.0577 20.1725 11.346 21.0096 10.898C21.8467 10.45 22.8083 10.2908 23.7452 10.4449C24.682 10.5991 25.5418 11.0581 26.1912 11.7508C27.1567 11.5603 28.0827 11.2064 28.9291 10.7044C28.6074 11.7026 27.9341 12.5501 27.0344 13.0891C27.889 12.9881 28.7237 12.7594 29.5104 12.4105C28.9316 13.276 28.203 14.0313 27.3591 14.6411H27.3599Z"
        fill="white"
      />
    </Svg>
  );
};

export default Icon;
