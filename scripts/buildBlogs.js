const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fm = require('front-matter');
const cryptoMd5 = require('md5');

const CACHE_PATH = path.resolve(__dirname, '../.blogs');
const MD_CACHE_PATH = path.join(CACHE_PATH, 'md');
const MANIFEST_CACHE_PATH = path.join(CACHE_PATH, 'manifest.js');
const BLOG_PATH = path.resolve(__dirname, '../src/blogs');

let manifest;
if (fs.statSync(MANIFEST_CACHE_PATH).isFile()) {
  manifest = require(MANIFEST_CACHE_PATH);
} else {
  manifest = {
    index: 0,
    titleMap: {},
  };
}
const { index, titleMap } = manifest;

fs.readdirSync(BLOG_PATH).forEach(file => {
  const pth = path.resolve(BLOG_PATH, file);
  const stat = fs.statSync(pth);
  if (stat.isFile() && /.md$/.test(file)) {
    let data = fs.readFileSync(pth, { encoding: 'utf-8' });
    // 提取YAML头部
    const content = fm(data);

    if (!titleMap[file]) {
      index = index + 1;
      titleMap[file] = { id: index };
    }
    const md5 = cryptoMd5(content.body);
    if (titleMap[file].md5 !== md5) {
      fs.writeFileSync(path.join(MD_CACHE_PATH, `${index}`), content.body, {
        encoding: 'utf-8',
      });
      titleMap[file].md5 = md5;
    }

    fillFrontMatter(titleMap[file], {
      title: file,
      ...content.attributes,
    });
  }
});

fs.writeFileSync(MANIFEST_CACHE_PATH, stringifyManifest(), {
  encoding: 'utf-8',
});

function fillFrontMatter(file, attributes) {
  file.title = attributes.title;
  file.description = attributes.description || '';
  file.date = attributes.date || '';
  file.author = attributes.author || '';
  file.tags = attributes.tags || [];
}

function stringifyManifest() {
  return (
    `module.exports = {\n` +
    `index: ${index},\n` +
    `titleMap: ${JSON.stringify(titleMap)}` +
    `}`
  );
}

chalk.green('Build Success!');
