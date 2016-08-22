'use strict'

var xml2js = require('xml2js')
var Promise = require('bluebird')

//把xml解析成不完美的json
exports.parseXMLAsync = function (xml) {
    //返回一个promise对象
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if(err) {
                reject(err)
            }else {
                resolve(content)
            }
        })
    })
}

//把不完美的json解析成完美的Json
function formatMessage (result) {
    //最终返回出去的对象
    var message = {}
    if(typeof result === 'object') {
        //把key转成数组
        var keys = Object.keys(result)

        for (var i = 0; i < keys.length; i++) {
            var value = result[keys[i]],
                key = keys[i]
           //如果不是数组就不用管
           if(!(value instanceof Array) || value.length === 0) {
               continue
           }
           //如果是数组并且只有一项
           if(value.length === 1) {
               var val = value[0]
               //如果不是字符串而是对象的话 递归
               if(typeof val === 'object') {
                   message[key] = formatMessage(val)
               }else {
                   message[key] = (val || '').trim()
               }
           }else {
               //如果是多项数组  那么同样需要递归解析数组的每一项
               message[key] = []
               for (var j = 0; j < value.length; j++) {
                    message[key].push(formatMessage(value[i]))                   
               }
           }
        }
    }
    //返回解析好的对象
    return message
}
exports.formatMessage = formatMessage