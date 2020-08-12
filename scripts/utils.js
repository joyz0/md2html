function replaceStrByConfig(str, config) {
  return config.reduce((result, { from, to }) => {
    return result.replace(from, to);
  }, str);
}

function isBlogExist(filename, cache) {
  for (const blog in cache) {
    if (blog.filename === filename) {
      return true;
    }
  }
  return false;
}

module.exports = {
  replaceStrByConfig,
  isBlogExist,
};
