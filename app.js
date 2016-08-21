'use strict'


//微信接入
var Koa = require('koa')
var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'wx26ea7a46eb71269b',
        appSecret: 'e6615fd6856a0144b619dec499d04cf5',  //前两个都是微信提供
        token: 'qiansiminwechat'   //自定义
    }
}

var app = new Koa()

app.use(function *(next) {
    console.log(this.query)
    let query = this.query 

    var token = config.wechat.token,
        signature = query.signature,
        nonce = query.nonce,
        timestamp = query.timestamp,
        echostr = query.echostr

    //字典排序
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if(sha === signature) {
        //返回 字符串
        this.body = echostr + ''
    }else {
        this.body = 'wrong'
    }
})

app.listen(1234)
console.log('Listen at on port: 1234')