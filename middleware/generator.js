'use strict'
// 中间件
var sha1 = require('sha1')
// koa只支持es6的generator函数
let joinWechat = function (opt) {
  // 因为koa use的函数必须是个generator函数 所以这里必须要包装下 retun 一个generator函数才可以
  return function * () {
    console.log(this.query)
    let query = this.query
    var token = opt.token,
      signature = query.signature,
      nonce = query.nonce,
      timestamp = query.timestamp,
      echostr = query.echostr

    // 字典排序
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (sha === signature) {
      // 返回 字符串
      this.body = echostr + ''
    }else {
      this.body = 'wrong'
    }
  }
}

module.exports = joinWechat
