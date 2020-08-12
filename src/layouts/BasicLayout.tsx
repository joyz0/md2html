import React from 'react';
import classNames from 'classnames';
import { BasicHeader } from '@/components/Layout';
import styles from './layout.less';

const BasicLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.basicContainer}>
      <div className={styles.header}>
        <BasicHeader></BasicHeader>
      </div>
      <div className={classNames('container', styles.content)}>{children}</div>
    </div>
  );
};

export default BasicLayout;
