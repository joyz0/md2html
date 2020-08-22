const { inspect } = require('util');
const merge = require('deepmerge');
const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const rehypeSlugs = require('rehype-slugs');
const rehypeAttrs = require('rehype-attributes');
const rehypeAttributes = require('rehype-attributes');
const sanitize = require('rehype-sanitize');
const gh = require('hast-util-sanitize/lib/github');
const format = require('rehype-format');
const htmlStringify = require('rehype-stringify');

// https://github.com/syntax-tree/hast-util-sanitize/blob/HEAD/lib/github.json
const schema = merge(gh, { clobberPrefix: 'slug-' });
const mdReg = /(?:\.\/)?(.*)\.md$/;
const urlReg = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;

function transformBlog(file) {
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
    .use(rehypeAttrs, {
      a: function(node) {
        var { href, target } = tagAReplacement(node);
        node.properties.href = href;
        node.properties.target = target;
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
module.exports = transformBlog;

function tagAReplacement(node) {
  var href = node.properties.href;
  var target = node.properties.target;
  if (!href) {
    return { href, target };
  }
  var match = mdReg.exec(href);
  if (match) {
    return { href: encodeURIComponent(match[1]) };
  }
  match = urlReg.exec(href);
  if (match) {
    return {
      href: match[1] ? href : '//' + href,
      target: '_blank',
    };
  }
  return {
    href,
    target,
  };
}
