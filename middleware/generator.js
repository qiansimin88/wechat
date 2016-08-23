'use strict'
// 中间件
var sha1 = require('sha1')
var Promise = require('bluebird')

var getRawBody = require('raw-body')

var Access_tokenHandle = require('./access_token')
var util = require('./util')

// koa只支持es6的generator函数
let joinWechat = function (opt, handle) {
  // 实例化这个accesstoken的函数并且运行
  var access_tokenHandle = new Access_tokenHandle(opt)
  // 因为koa use的函数必须是个generator函数 所以这里必须要包装下 retun 一个generator函数才可以
  return function * (next) {
    let query = this.query
    var token = opt.token,
      signature = query.signature,
      nonce = query.nonce,
      timestamp = query.timestamp,
      echostr = query.echostr

    // 字典排序
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (this.method === 'GET') {
      if (sha === signature) {
        // 返回 字符串
        this.body = echostr + ''
      } else {
        this.body = 'wrong'
      }
    }else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong'
        return false
      }
      var data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      })

      // 得到解析后的xml对象 yield相对得到then(data)里的data值
      var content = yield util.parseXMLAsync(data)
      // 这里的content的value是一个数组，必须继续解析
      var message = util.formatMessage(content.xml)
      // 进行判断 并且回复
       //把信息挂到this上
       this.weixin = message
       yield handle.call(this, next)

       access_tokenHandle.reply.call(this)
    }
  }
}

module.exports = joinWechat
