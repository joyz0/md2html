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
          ],
        },
        {
          path: '/blogs',
          component: '@/layouts/BlogLayout',
          routes: [
            {
              path: '/blogs',
              component: '@/pages/blogs/index',
              exact: true,
            },
            {
              path: '/blogs/:id',
              component: '@/pages/blogs/Detail',
            },
          ],
        },
        {
          component: '@/pages/exception/404',
        },
      ],
    },
  ],
});
