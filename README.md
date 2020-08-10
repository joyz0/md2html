## 灵感来源

https://www.ioiox.com/

## 技术选择

Umi3 体系搭建，组件体系选择 Adobe Spectrum 风格的 @adobe/react-spectrum。

## Getting Started

初始化，

```bash
mkdir portal && cd portal
yarn create @umijs/umi-app
```

本地验证，

```bash
yarn build
yarn global add serve
serve ./dist
```

目录结构

```
├── package.json
├── .umirc.ts
├── .env
├── dist
├── mock
├── public
└── src
    ├── .umi
    ├── layouts/index.tsx
    ├── pages
        ├── index.less
        └── index.tsx
    └── app.ts
```

## Umi3 参考文档

https://github.com/sorrycc/blog/issues/92

https://umijs.org/zh-CN/plugins/plugin-crossorigin
