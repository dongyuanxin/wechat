'use strict'
const {json2Xml} = require('./../utils/util')
const config = require('./../config/wechat')
const Wechat = require('./wechat')
const path = require('path')

const mediaPath = {
    image:path.join(__dirname,'..','static','test','image.jpg'),
    vedio:path.join(__dirname,'..','static','test','video.mp4')
}

let wechatApi = new Wechat(config)

let reply = async function(ctx,message){
    let data = {}
    data.fromUserName = message.ToUserName
    data.toUserName = message.FromUserName
    data.now = new Date().getTime()
    data.msgType = 'text' // 默认是text

    if(message.MsgType==='event') {
        if (message.Event==='subscribe') {
            data.content = '欢迎关注'
        } else if (message.Event ==='unsubscribe'){
            console.log("无情取关")
            return             
        } else if(message.Event === 'LOCATION') {
            data.content = `您的位置(经度:${message.Longitude},纬度:${message.Latitude})`
        } else if(message.Event === 'CLICK') {
            data.content = `您点击了 ${message.EventKey} 菜单`
        } else if(message.Event === 'SCAN') {
            data.content = `您进行了二维码扫描活动`
        } else if(message.Event === 'VIEW') {
            data.content = `您点击了菜单中的链接`
        }
    } else if (message.MsgType==='text'){
        let res ='',
            errCode = ''
        switch(message.Content) {
            case '文章':
                data.content = '测试'
                break
            default:
                data.msgType = 'news'
                data.content = [
                    {
                        title:'(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤',
                        description:'来自godbmw的问候',
                        picurl:'https://avatars0.githubusercontent.com/u/26399528?s=460&v=4',
                        url:'https://github.com/godbmw'
                    }
                ]
        }
    }
    ctx.response.status = 200
    ctx.response.body = json2Xml(data)
}
module.exports = {
    reply
}