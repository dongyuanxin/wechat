'use strict'
const {json2Xml} = require('./../utils/util')
const config = require('./../config/wechat')
const Wechat = require('./wechat')
const Weather = require('./weather')
const path = require('path')
const replyMessage = require('./../config/replyMessage')

const mediaPath = {
    image:path.join(__dirname,'..','static','test','image.jpg'),
    vedio:path.join(__dirname,'..','static','test','video.mp4')
}

let wechatApi = new Wechat(config)
let weather = new Weather()

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
            case '0':
                data.content = replyMessage['0']
                break
            case '1':
                data.msgType = 'news'
                data.content = replyMessage['1']
                break
            default:
                data.content = await wechatApi.chat(message.Content)
        }
    } else if (message.MsgType === 'voice') {
        data.content = await wechatApi.chat(message.Recognition)
    } else if(message.MsgType === 'location') {
        let label = message.Label,
            locX = message.Location_X,
            locY = message.Location_Y
        data.content = '地理位置 ' + label + '\n' + await weather.fetchNow(locY + ',' + locX)
    }
    ctx.response.status = 200
    ctx.response.body = json2Xml(data)
}
module.exports = {
    reply
}