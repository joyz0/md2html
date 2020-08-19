const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const { inspect } = require('util');
const chalk = require('chalk');
const fm = require('front-matter');
const cryptoMd5 = require('md5');

const insertSlugs = require('./insertSlugs');
const { replaceStrByConfig, isBlogExist } = require('./utils');
const {
  cacheDir,
  manifestFile,
  sourceDir,
  cacheHtmlDir,
  replaceConfig,
  fileCopyConfig,
} = require('../config/buildSettings').blogs;

// 初始化缓存目录
if (!fs.existsSync(cacheHtmlDir)) {
  const made = mkdirp.sync(cacheHtmlDir);
  console.log(chalk.green(`Made directories, starting with ${made}`));
}

let manifest;
// 加载已有的manifest
if (fs.existsSync(manifestFile)) {
  manifest = require(manifestFile);
} else {
  manifest = {
    index: 0,
    cache: {},
  };
}
let { index, cache } = manifest;

fs.readdirSync(sourceDir).forEach(file => {
  const pth = path.resolve(sourceDir, file);
  const stat = fs.statSync(pth);
  if (stat.isFile() && /.md$/.test(file)) {
    const filename = file.slice(0, file.lastIndexOf('.'));
    let data = fs.readFileSync(pth, { encoding: 'utf-8' });
    // 提取YAML头部
    const content = fm(data);
    if (content.attributes.skip) {
      // 不需要发布的博客
      return;
    }

    const md5 = cryptoMd5(content.body);

    // 替换文本
    if (Array.isArray(replaceConfig)) {
      content.body = replaceStrByConfig(content.body, replaceConfig);
    }

    let findId = isBlogExist(filename, cache);
    let findBlog;
    if (findId) {
      findBlog = cache[findId];
    } else {
      findBlog = {};
      findId = ++index;
    }

    const newBlog = {
      id: findId,
      filename,
    };

    const isModified = findBlog.md5 !== md5;
    if (isModified) {
      const { slugs, html } = insertSlugs(content.body);
      fs.writeFileSync(path.join(cacheHtmlDir, `${findId}.html`), html, {
        encoding: 'utf-8',
      });
      Object.assign(newBlog, { slugs });
    }
    Object.assign(newBlog, { md5 });
    Object.assign(newBlog, content.attributes);
    cache[findId] = newBlog;
  }
});

// 生成 Manifest 文件
fs.writeFileSync(manifestFile, generateManifest(), {
  encoding: 'utf-8',
});

// 如果有需要copy的文件
if (Array.isArray(fileCopyConfig)) {
  fileCopyConfig.forEach(({ from, to }) => {
    fse.copySync(from, to);
  });
}

console.log(chalk.green('Build Success!'));

function generateManifest() {
  return `
module.exports = {
  index: ${index},
  cache: ${inspect(cache, {
    depth: 3,
  })}
}
`;
}
