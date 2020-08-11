import React from 'react';
import styles from './layout.less';

const BlogLayout: React.FC = ({ children }) => {
  return <div className={styles.blogContainer}>{children}</div>;
};

export default BlogLayout;
