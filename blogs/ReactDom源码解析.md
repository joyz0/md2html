## WorkPhase

- NotWorking: 0
- BatchedPhase: 1
- LegacyUnbatchedPhase: 2
- FlushSyncPhase: 3
- RenderPhase: 4
- CommitPhase: 5

## ReactUpdate

- UpdateState: 0
- ReplaceState: 1
- ForceUpdate: 2
- CaptureUpdate: 3

## ReactDom.render(element, container, callback)的内部过程

1. 清空 container 中的内容，在 `container._reactRootContainer` 中挂载一个 ReactRootContainer，在`ReactRootContainer._internalRoot`中挂载一个 FiberRootNode，在`FiberRootNode.current`中挂载了一个未初始化的 FiberNode。

ReactRootContainer 的结构如下：

```js
{
  render(children, callback){},
  unmount(callback){},
  legacy_renderSubtreeIntoContainer(parentComponent, children, callback){},
  createBatch(){},
  _internalRoot
}
```

FiberRootNode 的结构如下：

```js
{
  // 原始dom节点
  // Any additional information from the host associated with this root.
  containerInfo,
  // Used only by persistent updates.
  pendingChildren,
  // The currently active root fiber. This is the mutable root of the tree.
  current,
  pingCache,
  pendingCommitExpirationTime,
  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork,
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if
  // it's superseded by a new one.
  timeoutHandle,
  // Top context object, used by renderSubtreeIntoContainer
  context,
  pendingContext,
  // Determines if we should attempt to hydrate on the initial mount
  hydrate,
  // List of top-level batches. This list indicates whether a commit should be
  // deferred. Also contains completion callbacks.
  firstBatch,
  // Node returned by Scheduler.scheduleCallback
  callbackNode,
  // Expiration of the callback associated with this root
  callbackExpirationTime,
  // The earliest pending expiration time that exists in the tree
  firstPendingTime,
  // The latest pending expiration time that exists in the tree
  lastPendingTime,
  // The time at which a suspended component pinged the root to render again
  pingTime,
}
```

FiberNode 结构如下：

```js
{
  // Tag identifying the type of fiber.
  tag,
  // Unique identifier of this child.
  key,
  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType,
  // The resolved function/class/ associated with this fiber.
  type,
  // The local state associated with this fiber.
  stateNode,
  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // 指向父节点
  return,
  // 指向第一个子节点
  child,
  // 指向相邻的兄弟节点
  sibling,
  index,
  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref,
  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps, // This type will be more specific once we overload the tag.
  memoizedProps, // The props used to create the output.
  // A queue of state updates and callbacks.
  updateQueue,
  // The state used to create the output
  memoizedState,
  // A linked-list of contexts that this fiber depends on
  contextDependencies,
  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode,
  // Effect
  effectTag,
  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect,
  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect,
  lastEffect,
  // Represents a time in the future by which this work should be completed.
  // Does not include work found in its subtree.
  expirationTime,
  // This is used to quickly determine if a subtree has no pending changes.
  childExpirationTime,
  // 开始是自身的克隆，当fiber发生更新时，都会先作用于alternate，更新结束后再替换旧的fiber。这样方便做diff和数据恢复。
  alternate,
  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration,
  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime,
  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration,
  // Sum of base times for all descedents of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration,
  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only
  _debugID,
  _debugSource,
  _debugOwner,
  _debugIsCurrentlyTiming,
  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes,
}
```

2. 执行`ReactRootContainer.render()`方法

```js
ReactRoot.prototype.render = function (children, callback) {
  const root = this._internalRoot
  // ReactWork就是一个Promise模型
  const work = new ReactWork()
  callback = callback === undefined ? null : callback
  if (callback !== null) {
    work.then(callback)
  }
  // _onCommit方法会切换ReactWork的内部状态，并执行通过then方法注册的回调函数
  updateContainer(children, root, null, work._onCommit)
  return work
}
function updateContainer(element, container, parentComponent, callback) {
  const current = container.current
  const currentTime = requestCurrentTime()
  // 应该是为时间分片服务
  const expirationTime = computeExpirationForFiber(currentTime, current)
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback
  )
}
function updateContainerAtExpirationTime(
  element,
  container,
  parentComponent,
  expirationTime,
  callback
) {
  // 获取FaberNode
  const current = container.current
  const context = getContextForSubtree(parentComponent)
  if (container.context === null) {
    container.context = context
  } else {
    container.pendingContext = context
  }
  return scheduleRootUpdate(current, element, expirationTime, callback)
}
function scheduleRootUpdate(current: Fiber, element, expirationTime, callback) {
  // current是root fiber
  const update: Update = createUpdate(expirationTime)
  update.payload = { element }
  callback = callback === undefined ? null : callback
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback
    )
    update.callback = callback
  }
  // 如果ReactFiberScheduler.js中的rootWithPendingPassiveEffects=null时什么都不做
  flushPassiveEffects()
  // 根据 fiber.memoizedState 和 update 对象创建fiber.updateQueue，updateQueue的格式见下文
  enqueueUpdate(current, update)
  // ReactFiberScheduler.js：实际调用的是scheduleUpdateOnFiber，之后调用renderRoot获取commitRoot，commitRoot是真正执行dom修改的地方
  scheduleWork(current, expirationTime)
  return expirationTime
}
```

其中 updateQueue 的格式为：

```ts
interface Update {
  expirationTime
  tag
  payload
  callback
  next
  nextEffect
}
interface updateQueue {
  baseState: fiber.memoizedState
  firstUpdate: Update
  lastUpdate: Update
  firstCapturedUpdate: Update
  lastCapturedUpdate: Update
  firstEffect: Update
  lastEffect: Update
  firstCapturedEffect: Update
  lastCapturedEffect: Update
}
```

scheduleWork 方法内部最终会执行 ReactFiberScheduler.js 中的 renderRoot 函数，它主要做了如下事情：

- 创建此 root 节点的 WorkInProgress 树
- 进行任务分片
- beginWork（ReactFiberBeginWork.js），它会根据 fiber.tag 标识的节点类型进行不同的处理，其中就包含函数式组件 hooks 的初始化入口--ReactCurrentDispatcher
- 返回 commitRoot 方法，此方法是真正执行 dom 修改的地方
