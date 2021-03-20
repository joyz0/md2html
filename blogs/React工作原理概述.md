本文的初衷是对 React 的工作原理做一个概述，在未来的某一天对 React 理解生疏了之后，可以复习这篇文章快速重新梳理明白 React 的整体运作机制，因此本文不会具体到源码实现细节，因为那样篇幅太长了，具体的实现原理会在其他文章做一个详细解析。

## Fiber 的初衷

V16 之前的 React，当第一次加载组件或之后的更新，所有操作都是同步的，包括生命周期函数的执行，diff，最终更新 dom 等，假设这个过程会持续 500ms，那么这期间就会一直霸占浏览器渲染进程中的主线程，此时对于用户而言，这个网页是处于卡死状态的，比如在一个 input 框进行键盘输入会得不到即时反应（此类操作是否可以由 Compositor 线程处理？），待 500ms 过后之前输入的一下子蹦出来了。

怎么优化呢？如果把 500ms 的同步任务分片成 10 个 50ms 的任务，虽然总时间没变，但是主线程不会在 500ms 中被一个任务独占，期间可以处理其他优先级更高的任务，之前 input 框键盘输入的情况就会每 50ms 就得到浏览器的反馈，当然上述说的数值都是一个举例。V16 之后的 React 确实是按照这个思路做的，而 Fiber 就是支持时间分片和任务调度的数据结构，React 源码中最令人难以读懂的估计就是处理这部分逻辑的部分了。

## 两个阶段

V16 之后，整个更新过程从原来的一气呵成变成了两个阶段--Reconciliation 和 Commit。Reconciliation 阶段主要对 state 和 props 数据进行处理得到需要更新的部分，该阶段可以被打断；Commit 阶段则是一鼓作气的更新作用于 dom，不可被打断。

两个阶段以 render 函数作为分界线，第一个阶段会执行 UNSAFE_componentWillMount、UNSAFE_componentWillReceiveProps、shouldComponentUpdate、static getDerivedStateFromProps 和 UNSAFE_componentWillUpdate，第二个阶段会执行 componentDidMount、componentDidUpdate 和 componentWillUnmount。第一个阶段的一些生命周期函数打上了 UNSAFE 标记，因为第一阶段可以被打断，并且会被优先级更高的任务插队，导致这些 unsafe 的函数会被执行多次，比如一个 A 任务被分成了 5 个时间片，当执行到了第 4 个时间片并且 UNSAFE_componentWillUpdate 已经被执行，此时出现了优先级更高的 B 任务，React 的任务调度机制会取消 A 任务去执行 B 任务，待 B 任务执行完毕后 A 任务会从头开始重新执行，导致 UNSAFE_componentWillUpdate 可能被执行多次。

## Work In Progress

React 在 Reconciliation 阶段会创建一个 WIP 树，挂载在 fiber.alternate 上，而 alternate.alternate 又指向 currentFiber，形成双向缓存，将要发生的变更都会作用于 WIP 树，这样设计的好处是便于 diff 和数据恢复。

## 源码组成

React 的源码可以分为四个部分：

1. react：构建基本 react 节点对象
2. react-dom：对浏览器 dom 的操作
3. react-reconciler：维护 fiber 结构
4. scheduler：任务调度

https://github.com/acdlite/react-fiber-architecture
https://zhuanlan.zhihu.com/p/26027085
https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3DZCuYPiUIONs
