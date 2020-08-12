import React, { useEffect, useLayoutEffect, DependencyList } from 'react';

export const useMutationObserver = (
  node: Node | null,
  options: MutationObserverInit,
  callback: Function,
  deps: DependencyList,
) => {
  let observer: MutationObserver;
  useLayoutEffect(() => {
    if (!node || observer) {
      return;
    }
    observer = new MutationObserver(() => {
      callback();
    });
    observer.observe(node, options);
  }, deps);
};
