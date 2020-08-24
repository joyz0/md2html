import React from 'react';
import styles from './DemoLayout.less';

const DemoLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.demoContainer}>
      <h1 className={styles.title}>演示</h1>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default DemoLayout;
