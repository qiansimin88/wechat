'use strict'

exports.reply = function *(next) {
    var message = this.weixin
    //事件推送
    if(message.MsgType === 'event') {
        //关注
        if(message.Event === 'subscribe') {
            if(message.EventKey) {
                console.log('扫二维码进来的：' + message.EventKey + '' + message.ticket)
            }
            //res返回
            this.body = '您已经成功订阅了\r\n'
        }else if (message.Event === 'unsubscribe') {
            //取消关注
            console.log('取消关注')
            this.body = ''
        }else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        }else if(message.Event === 'CLICK') {
            this.body = '您点击了菜单：' + message.EventKey
        }else if(message.Event === 'SCAN') {
            console.log('关注后扫二维码'+ message.EventKey+ '' + message.Ticket)
            this.body = '看到你扫了哦'
        }else if (message.Event === 'VIEW') {
            this.body = '您点击了链接:' + message.EventKey
        }
    }else if (message.MsgType == 'text'){
        var content = message.Content
        var reply = '额 你说的' + message.Content + '太复杂了'

        if(content === '1') {
            reply = '你打了1'
        }else if (content == '2') {
            reply = '你打了2'
        }else if (content == '4') {
            //图文
            reply = [{
                title: '技术改变世界',
                description: '描述',
                picUrl: 'http://picview01.baomihua.com/photos/20120330/m_14_634687153440937500_10397576.jpg',
                url: 'http://dev.m.3dker.cn'
            }
           ]
        }
        this.body = reply
    }
    yield next
}