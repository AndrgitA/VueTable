const path = require('path');
const webpack = require('webpack');
process.env.VUE_APP_DATE_DEPLOY = new Date();

module.exports = {
    // publicPath: process.env.NODE_ENV === 'production'
    //     ? '/panel/'
    //     : '/',
    // // publicPath: '/panel/',                      // -> process.env.BASE_URL
    chainWebpack: config => {
        config.module.rules.delete('eslint');
        
        // const svgRule = config.module.rule('svg');
        // svgRule.uses.clear();
        // svgRule 
        //     .use('vue-svg-loader')
        //     .loader('vue-svg-loader');
    },
    devServer: {
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        watchOptions: {
            poll: true
        }
    },
}