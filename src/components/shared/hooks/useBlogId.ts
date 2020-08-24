import React from 'react';
import { useModel } from 'umi';

interface MemoryItem {
  desc?: BlogDesc;
  content?: string;
}
interface FetchBlogContent {
  (): Promise<string>;
}
type UseBlogIdReturn = [MemoryItem['desc'], FetchBlogContent];

interface UseBlogId {
  (id?: string): UseBlogIdReturn;
}

const memory = new Map<string, MemoryItem>();
/**
 * 根据id异步获取blog信息内容
 * @param id
 */
export const useBlogId: UseBlogId = (id = '') => {
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );

  let blog: MemoryItem = {};

  if (id && memory.has(id)) {
    blog = memory.get(id)!;
  }

  if (!blog.desc) {
    blog.desc = initialState?.blogs.cache[id];
  }

  function fetchBlogContent() {
    if (blog.content) {
      return Promise.resolve(blog.content || '');
    } else {
      return import(
        /* webpackChunkName: "[request]" */
        /* webpackInclude: /\.html$/ */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        // '@/.blogs/html/' + id + '.html'
        '@/.blogs/html/React%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B.html'
      ).then(res => {
        blog.content = res.default;
        memory.set(id, blog);
        return blog.content || '';
      });
    }
  }

  return [blog.desc, fetchBlogContent];
};
