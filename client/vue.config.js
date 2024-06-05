const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const UselessFile = require('useless-files-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir);
}

// const isProd = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const { VueCDN, AxiosCDN, VueRouterCDN, VuexCDN, elementUICDN,elementUIcssCDN,leafletcssCDN,leafletjsCDN } = require('./src/plugins/cdn');

const cdn = {
  css: [elementUIcssCDN,leafletcssCDN],
  js: [VueCDN, AxiosCDN, VueRouterCDN, VuexCDN, elementUICDN,leafletjsCDN],
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    // 'element-ui': 'ELEMENT',
    vuex: 'Vuex',
    axios: 'axios',
    'leaflet': 'L'
  }
};

module.exports = {
  productionSourceMap: false,
  outputDir: 'dist',
  publicPath: './',
  lintOnSave: false,
  devServer: {
    port: 8888,
    // open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    historyApiFallback: true,
    proxy: {
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        ws: true,
        changeOrigin: true
      },
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:5000/'
        // changeOrigin: true
      },
      'report': {
        target: 'http://10.168.4.100:5001/',
        changeOrigin: true,
        pathRewrite: { '^/report': '' }
      },
      'video': {
        target: 'http://10.168.4.100:8080/',
        changeOrigin: true,
        pathRewrite: { '^/video': '' }
      },
    }
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       prependData: `@import "~@/styles/variables.scss";`
  //     }
  //   }
  // },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('postcss-pxtorem')({
              rootValue: 120, // 换算的基数 屏幕宽度/10
              propList: ['*'],// 需要转换的属性，*表示所有属性都需要转换
            })
          ]
        }

      }
    }
  },

  configureWebpack: {
    name: process.env.VUE_APP_BASE_NAME,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },

    externals: isProd ? cdn.externals : {}
  },
  
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.plugin('uselessFile')//移除无用文件
    .use(
      new UselessFile({
        root: './src', // 项目目录
        out: './fileList.json', // 输出文件列表
        clean: false, // 是否删除文件,
        exclude: [/node_modules/] // 排除文件列表
      })
    )
    // 设置svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    //设置开发环境sourceMap
    config.when(!isProd, config => config.devtool('cheap-source-map'));
    //生产环境
    config.when(isProd, config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          leaflet: {
            name: 'chunk-leaflet', // 将 leaflet 拆分为单个包
            priority: 20, // 权重需要大于 libs 和 app 否则会被打包到 libs 或 app 中
            test: /[\\/]node_modules[\\/]_?leaflet(.*)/ // 匹配文件
          },
          elementUI: {
            name: 'chunk-elementUI', // 将 elementUI 拆分为单个包
            priority: 20, // 权重需要大于 libs 和 app 否则会被打包到 libs 或 app 中
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 匹配文件
          },
          echarts: {
            name: 'chunk-echarts', // 将 echarts 拆分为单个包
            priority: 20, 
            test: /[\\/]node_modules[\\/]_?echarts(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: /[\\/]src[\\/]js[\\/]/,
            minChunks: 2, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });

      config.plugin('html').tap(args => {
        args[0].cdn = cdn;
        return args;
      });

      config.optimization.minimize(true);
      config.optimization.runtimeChunk('single');

      //去除生产环境debugger 和console
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.*'];
        return args;
      });
      //g-zip开启
      config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
        {
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css/, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          minRatio: 0.8
        }
      ]);
      //打包大小分析
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
      }
    });
  }
};
