import React, { useState, useEffect } from 'react';
import { ConnectProps, Redirect, history } from 'umi';
import mdConstructor from 'markdown-it';
import styles from './detail.less';

const md = mdConstructor('commonmark');

const Detail: React.FC<ConnectProps<{ id: string }>> = props => {
  const [mdStr, setMdStr] = useState('');
  const id = props.match?.params.id;
  useEffect(() => {
    try {
      const res = require(`../../.blogs/md/${id}.md`).default;
      setMdStr(md.render(res));
    } catch (error) {
      history.replace('/404');
    }
  }, [id]);
  console.log(props);
  return (
    <div className={styles.blogDetail}>
      <div dangerouslySetInnerHTML={{ __html: mdStr }}></div>
    </div>
  );
};

export default Detail;
