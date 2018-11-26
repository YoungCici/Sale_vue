var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.10.245:8912"'
  // BASE_API: '"http://cloud.hujia168.com:8912"'
  // BASE_API: '"http://alipay.hujia168.com"'
})
