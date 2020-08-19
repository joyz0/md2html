const path = require('path');

const BLOG_SOURCE_PATH = path.resolve(__dirname, '../blogs');
const BLOG_CACHE_PATH = path.resolve(__dirname, '../src/.blogs');

module.exports = {
  blogs: {
    sourceDir: BLOG_SOURCE_PATH,
    cacheDir: BLOG_CACHE_PATH,
    cacheHtmlDir: path.join(BLOG_CACHE_PATH, 'html'),
    manifestFile: path.join(BLOG_CACHE_PATH, 'manifest.js'),
    fileCopyConfig: [
      {
        from: path.join(BLOG_SOURCE_PATH, 'images'),
        to: path.resolve(__dirname, '../public/bimgs'),
      },
    ],
    replaceConfig: [
      {
        from: /(\!\[.*\]\().*images(\/.*\))/,
        to: '$1/bimgs$2',
      },
    ],
  },
};
