'use strict'
// 中间件
var sha1 = require('sha1')
var Promise = require('bluebird')

//让request具有promise属性
var request = Promise.promisify(require('request'))

// koa只支持es6的generator函数
let joinWechat = function (opt) {
 //实例化这个accesstoken的函数并且运行
 var access_tokenHandle = new Access_tokenHandle(opt)
  // 因为koa use的函数必须是个generator函数 所以这里必须要包装下 retun 一个generator函数才可以
  return function * () {
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


var prefix = 'https://api.weixin.qq.com/cgi-bin/token'
var api = {
    accessToken : prefix + '?grant_type=client_credential&'
}
//access_token的构造函数

function Access_tokenHandle (opts) {
    var that = this; 

    this.appID = opts.appID
    this.appSecret = opts.appSecret
    //获取
    this.getAccessToken = opts.getAccessToken
    //存储
    this.saveAccessToken = opts.saveAccessToken

    //promise函数
    this.getAccessToken()
        .then((data) => {
            //如果有就解析 没有就会报错 就走 更新
            try {
                //解析
                data = JSON.parse(data)
            }catch (e) {
                //返回一个可以更新access的promise的函数
                return this.updateAccessToken()
            }

            //如果验证通过
            if(this.isValidAccessToken(data)) {
                Promise.resolve(data)
            }else {
                return this.updateAccessToken()
            }
        })
        .then((data) => {
            this.access_token = data.access_token
            this.expires_in = data.expires_in
            this.saveAccessToken(data)
        })
}

//检查
Access_tokenHandle.prototype.isValidAccessToken = function (data) {
    if(!data || !data.access_token || !data.expires_in) {
        return false 
    }

    var access_tokenTime = data.expires_in
    var now = Date.now()

    //说明没过期
    if(now < access_tokenTime) {
        return true
    }else {
        return false 
    }
}

//更新
Access_tokenHandle.prototype.updateAccessToken = function (){
    var appID = this.appID
    var appSecret = this.appSecret
    var url = api.accessToken + 'appid=' + appID + '&secret=' + appSecret
    //返回的是个promise函数
    return new Promise((resolve, reject) => {
    //request 一个 npm库
        request({
            url: url,
            json: true
        }).then((response) => {
            var data = response.body
            var now = Date.now()
            //缩短20毫秒
            var expires_in = now + (data.expires_in - 20) * 1000   
            data.expires_in = expires_in
            resolve(data)
        })
    })
}

module.exports = joinWechat
