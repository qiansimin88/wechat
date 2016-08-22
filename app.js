'use strict'

//微信接入
var Koa = require('koa')
var sha1 = require('sha1')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./middleware/generator')

//access_Token的存放位
var wechat_conf = path.join(__dirname, './config/wechat.txt')

var config = {
    wechat: {
        appID: 'wx26ea7a46eb71269b',
        appSecret: 'e6615fd6856a0144b619dec499d04cf5',  //前两个都是微信提供
        token: 'qiansiminwechat',   //自定义
        getAccessToken () {
            //返回一个promise函数
            return util.readFileAsync(wechat_conf)
        },
        saveAccessToken (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_conf, data)
        }
    }
}

var app = new Koa()
//koa只支持es6的generator函数
app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listen at on port: 1234')