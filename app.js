'use strict'

//微信接入
var Koa = require('koa')
var sha1 = require('sha1')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./middleware/generator')
var config = require('./config')
var weixin = require('./weixin')

//access_Token的存放位
var wechat_conf = path.join(__dirname, './config/wechat.txt')


var app = new Koa()
//koa只支持es6的generator函数
app.use(wechat(config.wechat, weixin.reply))

app.listen(1234)
console.log('Listen at on port: 1234')