'use strict'
const {json2Xml} = require('./../../utils/util')

const config = require('./../../../config').wechat.base
const replyMessage = require('./../../../config').wechat.reply

const Wechat = require('./wechat')
const wechatApi = new Wechat(config)

let reply = async function(ctx,message){
    let data = {},
        dbResponse = {} // 数据库权限响应
    data.fromUserName = message.ToUserName
    data.toUserName = message.FromUserName
    data.now = new Date().getTime()
    data.msgType = 'text' // 默认是text
    if(message.MsgType==='event') {
        if (message.Event==='subscribe') {
            data.content = replyMessage.help
        } else if (message.Event ==='unsubscribe'){
            return console.log("无情取关")            
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
        let msgContent = message.Content.trim()
        msgContent = msgContent ? msgContent : ''
        if(msgContent === '帮助'|| msgContent === 'help') {
            data.content = replyMessage.help
        } else if (msgContent === '作者' || msgContent === 'author'){
            data.content = replyMessage.author
        } else {
            data.content =await wechatApi.chat(message.FromUserName,message.Content)
        }
    } else if (message.MsgType === 'voice') {
        data.content = await wechatApi.chat(message.FromUserName,message.Recognition)
    } else if (message.MsgType === 'location') {
        data.content = await wechatApi.fetchNowWeather(message)
    }
    ctx.response.status = 200
    ctx.response.body = json2Xml(data)
}
module.exports = {
    reply
}
