function replaceStrByConfig(str, config) {
  return config.reduce((result, { from, to }) => {
    return result.replace(from, to);
  }, str);
}

function isBlogExist(filename, cache) {
  for (const id in cache) {
    if (cache[id].filename === filename) {
      return true;
    }
  }
  return false;
}

module.exports = {
  replaceStrByConfig,
  isBlogExist,
};
