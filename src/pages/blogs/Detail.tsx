import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ConnectProps, Redirect, history } from 'umi';
import mdConstructor from 'markdown-it';
import { useMutationObserver, useMeasureDom } from '@/components/shared/hooks';
import classNames from 'classnames';
import styles from './detail.less';

const md = mdConstructor('commonmark');

const Detail: React.FC<ConnectProps<{ id: string }>> = props => {
  const [mdStr, setMdStr] = useState('');
  const mdRef = useRef<HTMLDivElement>(null);
  const id = props.match?.params.id;

  useMutationObserver(
    mdRef, // 这里如果使用mdRef.current，第一次会是null，因为是值类型
    {
      childList: true,
    },
    () => {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block);
        hljs.lineNumbersBlock(block);
      });
    },
  );

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
    <div className={styles.blogContainer}>
      <div className={styles.left}>1</div>
      <div className={styles.middle}>
        <div
          className={classNames(styles.content, 'atom-one-dark')}
          ref={mdRef}
          dangerouslySetInnerHTML={{ __html: mdStr }}
        ></div>
      </div>
      <div className={styles.right}>3</div>
    </div>
  );
};

export default Detail;
