import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC<{}> = () => (
  <div>
    <button onClick={() => history.push('/')}>Back Home</button>
  </div>
);

export default NoFoundPage;
