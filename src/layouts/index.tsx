import '@/styles/globals.css';
import React, { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import { Outlet } from 'umi';
import '../i18n';
import styles from './index.less';

const BasicLayout: React.FC = () => {
  return (
    <StrictMode>
      <RecoilRoot>
        <div className={styles.normal}>
          <Outlet />
        </div>
      </RecoilRoot>
    </StrictMode>
  );
};

export default BasicLayout;
