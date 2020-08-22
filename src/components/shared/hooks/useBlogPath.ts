import React from 'react';
import { useModel } from 'umi';

const idReg = /\d+/;
const mdReg = /(.*)\.md$/;

const memory = new Map();
/**
 * 转译blogDetail页面截取到的id
 * @param path
 */
export const useBlogPath = (path?: string) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );

  if (!path) {
    return null;
  }
  if (memory.has(path)) {
    return memory.get(path);
  }

  let result;
  if (idReg.test(path)) {
    if (Number(path) <= initialState!.blogs.index) {
      result = path;
    }
  } else if (mdReg.test(path)) {
    const mdRegRes = mdReg.exec(path);
    if (mdRegRes) {
      result = searchIdByName(mdRegRes[1], initialState!.blogs.cache);
    }
  } else {
    result = searchIdByName(path, initialState!.blogs.cache);
  }

  if (result) {
    memory.set(path, result);
  }

  return [result, result !== path];
};

function searchIdByName(name: string, cache: ManifestBlog['cache']) {
  for (const id in cache) {
    if (cache[id].filename === name) {
      return id;
    }
  }
}
