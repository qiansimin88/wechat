'use strict'

var fs = require('fs')
var Promise = require('bluebird')


exports.readFileAsync = function (fpath, encoding) {
    //继续返回promise
    return new Promise((resolve, reject) => {
        fs.readFile(fpath, encoding, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

exports.writeFileAsync = function (fpath, data) {
    //继续返回promise
    return new Promise((resolve, reject) => {
        fs.writeFile(fpath, data, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}