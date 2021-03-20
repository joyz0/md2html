核心代码逻辑入口在 ReactFiberBeginWork.js 的 beginWork 函数中，它会根据当前 fiber.tag 所标识的节点类型进行相应处理，

```ts
// ReactFiberBeginWork.js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
) {
  switch (workInProgress.tag) {
    case FunctionComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
    }
  }
}
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  let nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    context,
    renderExpirationTime
  )
  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime)
  return workInProgress.child
}

// ReactFiberHooks.js
function renderWithHooks(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  props: any,
  refOrContext: any,
  nextRenderExpirationTime: ExpirationTime
) {
  ReactCurrentDispatcher.current =
    nextCurrentHook === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate
  let children = Component(props, refOrContext)
  return children
}
```

在 renderWithHooks 中会对 ReactCurrentDispatcher.current 进行初始化，我们日常使用的 useState 等 hooks 实际上调用的就是 ReactCurrentDispatcher.current.useState。

未完待续。。。
