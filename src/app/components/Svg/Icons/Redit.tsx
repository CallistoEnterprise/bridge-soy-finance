import React from 'react';
import Svg from '../Svg';
import { SvgProps } from '../types';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 38 38" width="38" height="38" {...props}>
      <path
        d="M22.7161 25.1903C21.8747 26.0317 20.0721 26.3323 18.7872 26.3323C17.5022 26.3323 15.6996 26.0317 14.8582 25.1903C14.763 25.0952 14.634 25.0417 14.4995 25.0417C14.3649 25.0417 14.2359 25.0952 14.1408 25.1903C14.0456 25.2854 13.9922 25.4145 13.9922 25.549C13.9922 25.6835 14.0456 25.8126 14.1408 25.9077C15.474 27.2409 18.0362 27.3469 18.7915 27.3469C19.5468 27.3469 22.1012 27.2418 23.4422 25.9077C23.5351 25.8114 23.587 25.6828 23.587 25.549C23.587 25.4152 23.5351 25.2866 23.4422 25.1903C23.395 25.1417 23.3386 25.103 23.2763 25.0766C23.2139 25.0502 23.1469 25.0366 23.0792 25.0366C23.0114 25.0366 22.9444 25.0502 22.8821 25.0766C22.8197 25.103 22.7633 25.1417 22.7161 25.1903Z"
        fill="white"
      />
      <path
        d="M16.435 20.7393C16.435 20.3522 16.3202 19.9737 16.1051 19.6518C15.89 19.3298 15.5843 19.0789 15.2266 18.9308C14.8689 18.7826 14.4753 18.7438 14.0955 18.8194C13.7158 18.8949 13.367 19.0813 13.0932 19.3551C12.8194 19.6289 12.633 19.9777 12.5575 20.3574C12.4819 20.7372 12.5207 21.1308 12.6689 21.4885C12.817 21.8462 13.0679 22.1519 13.3899 22.367C13.7118 22.5821 14.0903 22.6969 14.4774 22.6969C14.9963 22.696 15.4937 22.4895 15.8607 22.1226C16.2276 21.7556 16.4341 21.2583 16.435 20.7393Z"
        fill="white"
      />
      <path
        d="M18.7837 1.97542e-08C15.0688 -0.000170319 11.4372 1.10128 8.34827 3.16506C5.25934 5.22883 2.85177 8.16225 1.43001 11.5943C0.00825348 15.0264 -0.363832 18.8031 0.36081 22.4466C1.08545 26.0902 2.87427 29.437 5.50106 32.064C8.12785 34.6909 11.4746 36.4798 15.1182 37.2047C18.7617 37.9295 22.5383 37.5575 25.9705 36.1359C29.4026 34.7143 32.3362 32.3069 34.4001 29.2181C36.464 26.1292 37.5656 22.4977 37.5656 18.7828C37.5652 13.8016 35.5862 9.0245 32.0641 5.50217C28.5419 1.97983 23.7649 0.000685142 18.7837 1.97542e-08V1.97542e-08ZM29.681 21.2882C29.723 21.5603 29.7443 21.8353 29.7447 22.1106C29.7447 26.3256 24.8356 29.7404 18.7871 29.7404C12.7386 29.7404 7.82955 26.3256 7.82955 22.1106C7.82983 21.8327 7.85114 21.5552 7.89328 21.2804C7.52965 21.1169 7.20613 20.8759 6.94535 20.5744C6.68457 20.2728 6.49282 19.9178 6.38352 19.5344C6.27423 19.151 6.25002 18.7483 6.31259 18.3546C6.37516 17.9608 6.523 17.5855 6.74578 17.2548C6.96855 16.9242 7.26087 16.6462 7.60229 16.4403C7.94372 16.2344 8.326 16.1056 8.72241 16.0628C9.11881 16.0201 9.51976 16.0645 9.89722 16.1929C10.2747 16.3213 10.6195 16.5307 10.9076 16.8063C13.108 15.3098 15.7033 14.5005 18.3643 14.4809C18.3643 14.443 19.7319 7.92945 19.7319 7.92945C19.7448 7.86683 19.77 7.8074 19.8061 7.75462C19.8422 7.70183 19.8884 7.65675 19.942 7.62199C19.996 7.58693 20.0563 7.56287 20.1196 7.55119C20.1828 7.53951 20.2478 7.54045 20.3107 7.55395L24.8615 8.52629C25.0718 8.09899 25.4308 7.76307 25.8711 7.58151C26.3114 7.39995 26.8028 7.38521 27.2532 7.54005C27.7036 7.69489 28.082 8.00868 28.3176 8.42261C28.5532 8.83653 28.6297 9.32216 28.5329 9.78848C28.436 10.2548 28.1724 10.6698 27.7914 10.9556C27.4105 11.2415 26.9383 11.3786 26.4635 11.3412C25.9887 11.3039 25.5439 11.0946 25.2123 10.7527C24.8807 10.4108 24.6853 9.95971 24.6625 9.48399L20.5845 8.61758L19.3375 14.4895C21.9537 14.5328 24.5001 15.3412 26.6623 16.8149C27.0485 16.4409 27.5364 16.189 28.0649 16.0906C28.5934 15.9922 29.1392 16.0517 29.6341 16.2616C30.129 16.4715 30.5511 16.8226 30.8477 17.271C31.1443 17.7194 31.3023 18.2452 31.3018 18.7828C31.3012 19.3123 31.1477 19.8303 30.8599 20.2747C30.5721 20.7191 30.1621 21.071 29.6792 21.2882H29.681Z"
        fill="white"
      />
      <path
        d="M23.0891 18.7832C22.7019 18.7832 22.3234 18.898 22.0015 19.1131C21.6796 19.3282 21.4287 19.634 21.2805 19.9917C21.1323 20.3494 21.0935 20.743 21.1691 21.1227C21.2446 21.5024 21.4311 21.8513 21.7048 22.125C21.9786 22.3988 22.3274 22.5853 22.7072 22.6608C23.0869 22.7363 23.4805 22.6976 23.8382 22.5494C24.1959 22.4012 24.5017 22.1503 24.7168 21.8284C24.9319 21.5065 25.0467 21.128 25.0467 20.7408C25.0458 20.2219 24.8392 19.7245 24.4723 19.3576C24.1054 18.9906 23.608 18.7841 23.0891 18.7832Z"
        fill="white"
      />
    </Svg>
  );
};

export default Icon;
