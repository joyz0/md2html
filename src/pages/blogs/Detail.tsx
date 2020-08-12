import React, { useState, useEffect, useRef } from 'react';
import { ConnectProps, Redirect, history } from 'umi';
import mdConstructor from 'markdown-it';
import { useMutationObserver } from '@/components/shared/hooks';
import styles from './detail.less';

const md = mdConstructor('commonmark');

const Detail: React.FC<ConnectProps<{ id: string }>> = props => {
  const [mdStr, setMdStr] = useState('');
  const mdRef = useRef<HTMLDivElement>(null);
  const id = props.match?.params.id;

  useMutationObserver(
    mdRef.current,
    {
      childList: true,
      subtree: true,
    },
    () => {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block);
      });
    },
    [mdRef.current],
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
    <div className={styles.blogDetail}>
      <div
        data-test="1"
        className={styles.content}
        ref={mdRef}
        // dangerouslySetInnerHTML={{ __html: mdStr }}
      >
        {mdStr}
      </div>
    </div>
  );
};

export default Detail;
