const { inspect } = require('util');
const merge = require('deepmerge');
const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const rehypeSlugs = require('rehype-slugs');
const sanitize = require('rehype-sanitize');
const gh = require('hast-util-sanitize/lib/github');
const format = require('rehype-format');
const htmlStringify = require('rehype-stringify');

// https://github.com/syntax-tree/hast-util-sanitize/blob/HEAD/lib/github.json
const schema = merge(gh, { clobberPrefix: 'slug-' });

function insertSlugs(file) {
  let slugs;
  const vfile = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(rehypeSlugs, {
      prefix: 'slug-',
      maxDepth: 3,
      callback: function(res) {
        slugs = res;
      },
    })
    .use(format)
    .use(sanitize, schema)
    .use(htmlStringify)
    .processSync(file);
  return {
    slugs,
    html: String(vfile),
  };
}
module.exports = insertSlugs;
