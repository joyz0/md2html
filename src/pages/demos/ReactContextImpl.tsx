import React from 'react';

interface CustomContext<T> {
  $$typeof: symbol;
  _currentValue: T;
  Provider: any;
  Consumer: any;
}

function createContext<T>(defaultValue: T): CustomContext<T> {
  const context: CustomContext<T> = {
    $$typeof: Symbol.for('react.context'),
    _currentValue: defaultValue,
    Provider: null,
    Consumer: null,
  };
  context.Provider = {
    $$typeof: Symbol.for('react.provider'),
    _context: context,
  };
  context.Consumer = context;
  return context;
}

const NameContext = createContext<{ name: string }>({
  name: '朱亘',
});

function attachCustomContext(
  element: React.ReactElement<any, any> & React.ExoticComponent,
) {
  if (!React.isValidElement(element)) return;
  switch (element.type.$$typeof) {
    case Symbol.for('react.provider'):
      element.type._context._currentValue = element.props.value;
      break;
    case Symbol.for('react.context'):
      element.type._currentValue.hack = true;
      break;
  }
  attachCustomContext(element.props.children);
}

const ReactContextImpl: React.FC = props => {
  const pendingState = { name: '朱一旦' };
  const element = (
    <NameContext.Provider value={pendingState}>
      <NameContext.Consumer>
        {(value: any) => {
          return <div>{value.name}</div>;
        }}
      </NameContext.Consumer>
    </NameContext.Provider>
  );
  attachCustomContext(element as any);
  return element;
};

export default ReactContextImpl;
