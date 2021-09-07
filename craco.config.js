const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            //https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
            modifyVars: { '@body-background': '#333333', '@component-background': '#333333', '@border-color-base': '#444444', '@border-color-split': '#444444' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};