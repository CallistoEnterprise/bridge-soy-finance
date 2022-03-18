import React from 'react';
import Svg from '../Svg';
import { SvgProps } from '../types';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 39 39" width="39" height="39" {...props}>
      <path
        d="M19.1196 38.2391C22.9009 38.2391 26.5973 37.1179 29.7414 35.0172C32.8855 32.9165 35.3361 29.9307 36.7833 26.4373C38.2306 22.9439 38.6094 19.0998 37.872 15.3911C37.1347 11.6824 35.3141 8.27561 32.6406 5.60152C29.9672 2.92743 26.5608 1.10613 22.8522 0.367911C19.1437 -0.370308 15.2995 0.00770882 11.8058 1.45416C8.31209 2.90062 5.32572 5.35055 3.22432 8.49418C1.12292 11.6378 0.000852131 15.334 4.84978e-07 19.1153C-0.000565096 21.6264 0.49356 24.1131 1.45415 26.4333C2.41475 28.7535 3.82299 30.8617 5.59847 32.6376C7.37394 34.4135 9.48185 35.8222 11.8018 36.7833C14.1218 37.7444 16.6084 38.2391 19.1196 38.2391ZM8.75021 18.7036L27.1868 11.5949C28.0429 11.2857 28.7896 11.8033 28.5123 13.0978L25.3748 27.8853C25.1422 28.9334 24.5187 29.1883 23.6471 28.6948L18.8664 25.1715L16.5608 27.3927C16.4473 27.5401 16.3013 27.6592 16.1341 27.7408C15.9669 27.8224 15.7831 27.8642 15.5971 27.8629L15.9364 22.9977L24.796 14.9934C25.1818 14.654 24.7099 14.4628 24.2017 14.8004L13.2528 21.6904L8.53318 20.2176C7.5083 19.893 7.48591 19.1928 8.75021 18.6993V18.7036Z"
        fill="white"
      />
    </Svg>
  );
};

export default Icon;
