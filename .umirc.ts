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
        { path: '/', component: '@/pages/index' },
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
      ],
    },
  ],
});
