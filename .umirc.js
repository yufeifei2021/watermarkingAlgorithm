import path from 'path';

export default {
  npmClient: 'yarn',
  // 如果想使用 vite开发，请使用 npm run dev:vite
  // 同时 代码中的 process.env 需要替换成 import.meta.env
  vite: process.env.VITE_ENV === 'vite' && {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@aloudata/aloudata-design/lib/style/index.less";`,
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  history: {
    type: 'hash',
  },

  // 定义页面路由
  routes: [
    {
      exact: true,
      path: '/',
      component: '@/pages/Index',
    },
    {
      path: '/buttons',
      component: '@/pages/Buttons',
    },
    {
      path: '/buttons/addExtractWatermark',
      component: '@/pages/AddExtractWatermark',
    },
    {
      path: '/buttons/watermarkSuperposition',
      component: '@/pages/WatermarkSuperposition',
    },
    {
      path: '/buttons/robustness',
      component: '@/pages/Robustness',
    },
    {
      path: '/buttons/robustness/tableList',
      component: '@/pages/Index/components/TableList',
    },
  ],
  // extraPostCSSPlugins: [
  //   // 所有overflow值为scroll和auto的元素，都会被添加overflow: overlay的样式,overlay产生的滚动条，不会占用元素空间
  //   require('./scripts/overflow_overlay_plugin')(),
  // ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@aloudata/aloudata-design',
        libraryDirectory: 'es',
        style: (name) => {
          return `${name}/style/index.less`;
        },
        camel2DashComponentName: false,
      },
    ],
  ],
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      defaultTheme: `true; @import "~@aloudata/aloudata-design/lib/style/index.less";`,
    },
  },
};
