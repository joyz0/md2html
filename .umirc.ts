import { defineConfig } from 'umi';

export default defineConfig({
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
