import { defineConfig } from 'umi';

export default defineConfig({
  chainWebpack(config) {
    config.module
      .rule('html-file')
      .test(/.html$/)
      .use('html-loader')
      .loader('html-loader');
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/welcome' },
        { path: '/welcome', component: '@/pages/welcome' },
        {
          path: '/demos',
          component: '@/layouts/DemoLayout',
          routes: [
            {
              path: '/demos/react-hook-impl',
              component: '@/pages/demos/ReactHookImpl',
            },
            {
              path: '/demos/react-context-impl',
              component: '@/pages/demos/ReactContextImpl',
            },
            {
              path: '/demos/react-ref-confused',
              component: '@/pages/demos/ReactRefConfused',
            },
            {
              path: '/demos/camera-api',
              component: '@/pages/demos/CameraAPI/index',
            },
            {
              component: '@/pages/exception/404',
            },
          ],
        },
        {
          path: '/blogs',
          component: '@/pages/blogs/index',
          exact: true,
        },
        {
          path: '/blogs/:id',
          component: '@/pages/blogs/Detail',
        },
        {
          component: '@/pages/exception/404',
        },
      ],
    },
  ],
});
