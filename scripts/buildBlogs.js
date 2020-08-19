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
  mdCacheDir,
  replaceConfig,
  fileCopyConfig,
} = require('../config/buildSettings').blogs;

const DTS_FILE = path.join(cacheDir, 'blog.d.ts');

preBuild();

let manifest;
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
    if (!isBlogExist(filename, cache)) {
      index = index + 1;
      cache[index] = {
        id: index,
        filename,
      };
    }
    // 替换文本
    if (Array.isArray(replaceConfig)) {
      content.body = replaceStrByConfig(content.body, replaceConfig);
    }
    const md5 = cryptoMd5(content.body);
    if (cache[index].md5 !== md5) {
      const { slugs, html } = insertSlugs(content.body);
      fs.writeFileSync(path.join(mdCacheDir, `${index}.html`), html, {
        encoding: 'utf-8',
      });
      Object.assign(cache[index], { md5, slugs });
    }

    Object.assign(cache[index], content.attributes);
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

function preBuild() {
  const dtsTmp = `
export interface Slug {
  id: string;
  depth: number;
  tagName: string;
  text: string;
}
export interface Blog {
  id: number;
  md5: string;
  filename: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  categories?: [string, string];
  tags?: string[];
  complexity: 'easy' | 'ordinary' | 'hard';
  slugs: Slug[];
}
export interface ManifestBlog {
  index: number;
  cache: {
    [key: string]: Blog;
  };
}
`;
  if (!fs.existsSync(mdCacheDir)) {
    const made = mkdirp.sync(mdCacheDir);
    fs.writeFileSync(DTS_FILE, dtsTmp, { encoding: 'utf-8' });
    console.log(chalk.green(`Made directories, starting with ${made}`));
  }
}
