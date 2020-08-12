const { replaceStrByConfig } = require('../utils');

describe('utils', () => {
  const config = [
    {
      from: /(\!\[.*\]\().*images(\/.*\))/,
      to: '$1/bimgs$2',
    },
  ];
  const str = '\nhello![](images/react_dom_render.png)hello\n';

  it('replaceStrByConfig', () => {
    const result = replaceStrByConfig(str, config);
    expect(result).toBe('\nhello![](/bimgs/react_dom_render.png)hello\n');
  });
});
