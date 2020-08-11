const fs = require('fs');
const { inspect } = require('util');
const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');
const fm = require('front-matter');
const cryptoMd5 = require('md5');

const CACHE_PATH = path.resolve(__dirname, '../.blogs');
const MD_CACHE_PATH = path.join(CACHE_PATH, 'md');
const MANIFEST_FILE = path.join(CACHE_PATH, 'manifest.js');
const DTS_FILE = path.join(CACHE_PATH, 'blog.d.ts');
const BLOG_PATH = path.resolve(__dirname, '../src/blogs');

initBlogs();

let manifest;
if (fs.existsSync(MANIFEST_FILE)) {
  manifest = require(MANIFEST_FILE);
} else {
  manifest = {
    index: 0,
    infos: {},
  };
}
let { index, infos } = manifest;

fs.readdirSync(BLOG_PATH).forEach(file => {
  const pth = path.resolve(BLOG_PATH, file);
  const stat = fs.statSync(pth);
  if (stat.isFile() && /.md$/.test(file)) {
    const name = file.slice(0, file.lastIndexOf('.'));
    let data = fs.readFileSync(pth, { encoding: 'utf-8' });
    // 提取YAML头部
    const content = fm(data);

    if (!infos[name]) {
      index = index + 1;
      infos[name] = { id: index };
    }
    const md5 = cryptoMd5(content.body);
    if (infos[name].md5 !== md5) {
      fs.writeFileSync(path.join(MD_CACHE_PATH, `${index}.md`), content.body, {
        encoding: 'utf-8',
      });
      infos[name].md5 = md5;
    }

    fillFrontMatter(infos[name], {
      title: name,
      ...content.attributes,
    });
  }
});

fs.writeFileSync(MANIFEST_FILE, stringifyManifest(), {
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
    `infos: ${inspect(infos)}` +
    `}`
  );
}

function initBlogs() {
  const dtsTmp = `
export interface Blog {
  id: number;
  md5: string;
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  complexity: 'easy' | 'ordinary' | 'hard';
}
export interface ManifestBlog {
  index: number;
  infos: {
    [key: string]: Blog;
  };
}
`;
  if (!fs.existsSync(MD_CACHE_PATH)) {
    const made = mkdirp.sync(MD_CACHE_PATH);
    console.log(chalk.green(`Made directories, starting with ${made}`));
  }
  fs.writeFile(DTS_FILE, dtsTmp, { encoding: 'utf-8' }, err => {
    if (err) throw err;
    console.log(chalk.green(`${path.basename(DTS_FILE)} has been created!`));
  });
}

console.log(chalk.green('Build Success!'));
