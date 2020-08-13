---
date: 2020-8-13
complexity: hard
categories: [react, hooks]
tags: ['react']
---

在 createElement 时，不会把 ref 放到 props 属性中。

我列举了一些 ref 的使用方法，它们有区别，

```ts
const MeasureExample: React.FC = () => {
  const measureRef1 = useRef<HTMLParagraphElement>(null);
  const measureRef2 = useCallback(node => {
    // 调用了一次
  }, []);
  const measureRef3 = node => {
    // 调用了多次
  };

  useEffect(() => {
    // 我遇到了这里访问measureRef1.current = null的情况，不知道为什么（我当时用了dangerouslySetInnerHTML）！
  }, []);
  useEffect(() => {
    // 官方不建议把ref当作deps，为什么？
  }, [measureRef1.current]);

  return (
    <>
      <p ref={measureRef1}>1</p>
      <p ref={measureRef2}>2</p>
      <p ref={measureRef3}>3</p>
    </>
  );
};
```

ref 的赋值处，

```ts
// ReactFiberCommitWork.js
function commitAttachRef(finishedWork: Fiber) {
  // 赋值
}
function commitDetachRef(current: Fiber) {
  // 重置ref
}
function safelyDetachRef(current: Fiber) {
  // 重置ref
}
```

commitAttachRef 方法向上追溯的调用栈如下，

```ts
// ReactFiberWorkLoop.js
commitRoot();
commitRootImpl();
commitLayoutEffects();
commitLayoutEffectsImpl();
commitAttachRef();
```

commitDetachRef 方法向上追溯的调用栈如下，

```ts
// ReactFiberWorkLoop.js
commitRoot();
commitRootImpl();
commitMutationEffects();
commitMutationEffectsImpl();
commitDetachRef();
```

useEffect 和 useLayoutEffect 的区别，它们执行后，fiber.effectTag 会不同，workInProgressHook 链表中节点的 memoizedState.tag 会不同，除此之外就没有区别了。
