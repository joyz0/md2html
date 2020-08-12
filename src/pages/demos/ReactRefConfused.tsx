import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  RefObject,
} from 'react';

const MeasureExample: React.FC = () => {
  const [height, setHeight] = useState(0);

  // https://github.com/facebook/react/issues/16121
  // https://github.com/facebook/react/issues/14387
  // Because our ref is a callback, it still works
  // even if the ref only gets attached after button
  // click inside the child component.
  const measureRef1 = useCallback(node => {
    console.log('usecallback', node);
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  const measureRef2 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.log('object.current', measureRef2.current);
  }, [measureRef2.current]);

  return (
    <>
      <Child
        measureRef1={measureRef1}
        measureRef2={measureRef2}
        measureRef3={node => {
          console.log('pure function', node);
          if (node !== null) {
            setHeight(node.getBoundingClientRect().height);
          }
        }}
      />
      {height > 0 && <h2>The above header is {Math.round(height)}px tall</h2>}
    </>
  );
};

interface ChildProps {
  measureRef1(node: any): void;
  measureRef2: RefObject<HTMLHeadingElement>;
  measureRef3(node: any): void;
}
const Child: React.FC<ChildProps> = ({
  measureRef1,
  measureRef2,
  measureRef3,
}) => {
  const [show, setShow] = useState(false);
  if (!show) {
    return <button onClick={() => setShow(true)}>Show child</button>;
  }
  return (
    <div>
      <h1 ref={measureRef1}>Hello, world</h1>
      <h1 ref={measureRef2}>Hello, world</h1>
      <h1 ref={measureRef3}>Hello, world</h1>
    </div>
  );
};

export default MeasureExample;
