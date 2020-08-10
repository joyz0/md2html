import React from 'react';
import { BasicHeader } from '@/components/Layout';
import styles from './layout.less';

const BasicLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.basicContainer}>
      <div className={styles.header}>
        <BasicHeader></BasicHeader>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BasicLayout;
