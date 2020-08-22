import React from 'react';
import classNames from 'classnames';
import BasicHeader from './BasicHeader';
import styles from './basic-layout.less';

const BasicLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.basicContainer}>
      <BasicHeader></BasicHeader>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BasicLayout;
