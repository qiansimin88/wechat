'use strict'

//微信接入
var Koa = require('koa')
var sha1 = require('sha1')
var wechat = require('./middleware/generator')
var config = {
    wechat: {
        appID: 'wx26ea7a46eb71269b',
        appSecret: 'e6615fd6856a0144b619dec499d04cf5',  //前两个都是微信提供
        token: 'qiansiminwechat'   //自定义
    }
}

var app = new Koa()
//koa只支持es6的generator函数
app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listen at on port: 1234')