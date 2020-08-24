import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ConnectProps, Redirect, history, dynamic } from 'umi';
import { useMutationObserver, useBlogId } from '@/components/shared/hooks';
import classNames from 'classnames';
import styles from './detail.less';

const Detail: React.FC<ConnectProps<{ id: string }>> = props => {
  const [blogContent, setBlogContent] = useState('');
  const mdRef = useRef<HTMLDivElement>(null);
  const blogId = props.match?.params.id;
  const [blogDesc, fetchBlogContent] = useBlogId(blogId);

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
    fetchBlogContent()
      .then(res => {
        setBlogContent(res);
      })
      .catch(err => {
        console.log(err);
        // history.replace('/404');
      });
  }, [blogId]);

  console.log(props);
  return (
    <div className={styles.blogWrapper}>
      <div className={styles.blogAside}>
        <a href="www.baidu.com">baidu</a>
      </div>
      <div className={styles.blogContent}>
        <div
          className={classNames(styles.content, 'atom-one-dark')}
          ref={mdRef}
          dangerouslySetInnerHTML={{ __html: blogContent }}
        ></div>
      </div>
      <div className={styles.blogToc}>3</div>
    </div>
  );
};

export default Detail;
