import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ConnectProps, Redirect, history, dynamic } from 'umi';
import {
  useMutationObserver,
  useBlogPath,
} from '@/components/shared/hooks';
import classNames from 'classnames';
import styles from './detail.less';

const Detail: React.FC<ConnectProps<{ id: string }>> = props => {
  const [mdStr, setMdStr] = useState('');
  const mdRef = useRef<HTMLDivElement>(null);
  const [id, shouldRedirect] = useBlogPath(props.match?.params.id);

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
    if (id) {
      if (shouldRedirect) {
        history.replace(id);
        return;
      }
      import(
        /* webpackChunkName: "[request]" */
        /* webpackInclude: /\.html$/ */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        // '@/.blogs/html/' + id + '.html'
        '@/.blogs/html/7.html'
      )
        .then(res => {
          setMdStr(res.default);
        })
        .catch(err => {
          console.log(err);
          // history.replace('/404');
        });
    } else {
      console.log('404');
      // history.replace('/404');
    }
    // try {
    //   const res = require(`/.blogs/html/${id}`).default;
    //   setMdStr(res);
    // } catch (error) {
    //   history.replace('/404');
    // }
  }, [id]);

  console.log(props);
  return (
    <div className={styles.blogContainer}>
      <div className={styles.left}>
        <a href="www.baidu.com">baidu</a>
      </div>
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
