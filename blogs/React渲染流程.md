```ts
├── ReactDOM.render(<App />, document.getElementById('root'))
  ├── legacyRenderSubtreeIntoContainer() => updateContainer() => scheduleUpdateOnFiber(current, lane, eventTime)
    ├── const root = markUpdateLaneFromFiberToRoot(fiber, lane) // V16 markUpdateTimeFromFiberToRoot
    ├── performSyncWorkOnRoot(root) // if: 同步
      ├── renderRootSync(root, lanes) // ✨Render/Reconciliation阶段
        ├── workLoopSync()
          ├── performUnitOfWork(workInProgress) // loop: workInProgress !== null
            ├── next = beginWork(current, unitOfWork, subtreeRenderLanes)
              ├── return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes) // if: workInProgress.tag === IndeterminateComponent
                ├── value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes) // 返回了ReactElement
                  ├── ReactCurrentDispatcher.current = HooksDispatcherOnMount // HooksDispatcherOnUpdate 挂载useXXX
                  ├── let children = Component(props, secondArg) // ✨调用render函数，🌈待探索hooks链表过程
                  ├── ReactCurrentDispatcher.current = ContextOnlyDispatcher // 重置useXXX
                ├── value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes) // if: __DEV__ && StrictMode 重复执行render函数
                ├── reconcileChildren(null, workInProgress, value, renderLanes) // ✨遍历后代节点，从value.props.children中获得后代信息，再连接到fiber.child上
                ├── return workInProgress.child
              ├── return updateClassComponent() // if: workInProgress.tag === ClassComponent
            ├── completeUnitOfWork(unitOfWork) // if: next === null 说明已经在最底层的子节点，🌈待调试探索，与performUnitOfWork相反根据fiber.return是向上遍历
      ├── commitRoot(root) // ✨Commit阶段，🌈待调试探索
        ├── commitRootImpl(root, renderPriorityLevel) // 🌈得仔细看下runWithPriority方法，涉及调度
          ├── commitMutationEffects(finishedWork, root, renderPriorityLevel) // ✨完成了dom的更新
          ├── commitLayoutEffects(finishedWork, root, lanes) // ✨赋值ref，触发useLayoutEffect回调函数
          ├── requestPaint() // 告诉Scheduler在当前渲染帧末尾返还控制权，让浏览器有机会渲染，🌈待探索如何实现的
    ├── performConcurrentWorkOnRoot() // 并发
```

在一棵渲染树，全局性数据都会存储在 fiberRoot 上，

没有找到 useEffect 回调函数是在说明阶段调用的，只知道在 scheduledHostCallback、workLoop 中，

insertDom 在哪个阶段，

useEffect 的回调函数会交由 BOM API 执行，而 useLayoutEffect 的回调函数是在 commit 阶段执行

invokeGuardedCallback
