setState 的 batchedUpdate 特性，核心代码如下：

```ts
// ReactFiberScheduler.js
export function batchedUpdates<A, R>(fn: A => R, a: A): R {
  if (workPhase !== NotWorking) {
    return fn(a);
  }
  workPhase = BatchedPhase;
  try {
    return fn(a);
  } finally {
    workPhase = NotWorking;
    // Flush the immediate callbacks that were scheduled during this batch
    flushImmediateQueue();
  }
}
```

```ts
// ReactFiberReconciler.js
export { batchedUpdates, unbatchedUpdates } from './ReactFiberScheduler';
```

```ts
// ReactGenericBatching.js
let _batchedUpdatesImpl = function(fn, bookkeeping) {
  return fn(bookkeeping);
};
let isBatching = false;
export function batchedUpdates(fn, bookkeeping) {
  if (isBatching) {
    return fn(bookkeeping);
  }
  isBatching = true;
  try {
    // 这里的_batchedUpdatesImpl会在ReactDom.js的setBatchingImplementation方法中被覆盖，其实就是ReactFiberScheduler.js的batchedUpdates函数
    return _batchedUpdatesImpl(fn, bookkeeping);
  } finally {
    isBatching = false;
    const controlledComponentsHavePendingUpdates = needsStateRestore();
    if (controlledComponentsHavePendingUpdates) {
      _flushInteractiveUpdatesImpl();
      restoreStateIfNeeded();
    }
  }
}
```

总结来讲，当发生 setState 时，会从当前节点出发向上遍历，直到根节点，把变化部分转化成更新任务队列记录在 fiber.updateQueue 上，之后再交由 schedular 从根节点开始处理 fiber.updateQueue；而在初次 ReactDOM.render 时无需向上遍历，因为本就处在根节点。

schedular 处理 fiber.updateQueue 并把更新作用于 WIP

https://makersden.io/blog/look-inside-fiber
