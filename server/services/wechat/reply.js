'use strict'
const {json2Xml} = require('./../../utils/util')
const config = require('./../../../config').wechat.base
const replyMessage = require('./../../../config').wechat.reply
const Wechat = require('./wechat')
const Weather = require('./weather')
const path = require('path')
const DataBase = require('./database')


let wechatApi = new Wechat(config)
let weather = new Weather()
let dbApi = new DataBase()

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
        let msgContent = message.Content.trim()
        msgContent = msgContent ? msgContent : ''
        if(msgContent === '帮助'|| msgContent === 'help') {
            data.content = replyMessage.help
        } else if (msgContent === '作者' || msgContent === 'author'){
            data.content = replyMessage.author
        } else {
            dbResponse = await dbApi.checkTimes(message.FromUserName,'chat')
            if(dbResponse.status === 0){
                try{
                    data.content = await wechatApi.chat(message.Content)
                    dbApi.updateTimes(message.FromUserName,'chat')
                } catch(err) { 
                    console.error(err)
                    data.content = '不好意思，服务器压力过大，请稍后再试'
                }
            }else if (dbResponse.status === 1){
                data.content = '不好意思，考虑到服务器压力。您今天的智能聊天次数已达上限。\n更多请回复:\'帮助\'或\'help\''
            } else {
                data.content = '不好意思，服务器压力过大，请稍后再试'
            }
        }
    } else if (message.MsgType === 'voice') {
        data.content = await wechatApi.chat(message.Recognition)
    } else if(message.MsgType === 'location') {
        let label = message.Label,
            locX = message.Location_X,
            locY = message.Location_Y
        dbResponse = await dbApi.checkTimes(message.FromUserName,'weather')
        if(dbResponse.status === 0){
            data.content = '地理位置 ' + label + '\n' + await weather.fetchNow(locY + ',' + locX)
            dbApi.updateTimes(message.FromUserName,'weather')
        } else if (dbResponse.status=== 1){
            data.content = '不好意思，考虑到服务器压力。您今天的天气查询次数已达上限。\n更多请回复:\'帮助\'或\'help\''
        } else {
            data.content = '不好意思，服务器压力过大，请稍后再试'
        }
    }
    ctx.response.status = 200
    ctx.response.body = json2Xml(data)
}
module.exports = {
    reply
}