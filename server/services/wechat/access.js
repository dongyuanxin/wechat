'use strict'
const sha1 = require('sha1')
const Wechat = require('./wechat') 
const Mysql = require('./../../models/mysql')
const path = require('path')
const {reply} = require('./reply')
const {sleep,formatJson} = require('./../../utils/util')
const config = require('./../../../config').wechat.base
let interval = null
let wechatApi = new Wechat(config) // 创建实例时，刷新票据
let mysqlApi = new Mysql()

async function rollbackDB(){
    let time = new Date()
    let hour = time.getHours() , dateStr = time.toLocaleDateString() , timeStr = time.toLocaleTimeString()
    console.log(`数据库回滚检查 ${dateStr}-${timeStr}`)
    if(hour===1){ // 每日凌晨一点刷新
        mysqlApi.rollbackTimes() 
        clearInterval(interval) // 清空定时器
        await sleep(1000 * 3600 + 1 ) // 更新后，等待1小时后再刷新
        interval = setInterval( rollbackDB, 1000 * 3600) 
    }
}
interval = setInterval( rollbackDB , 1000 * 3600) // 每20分钟检查一次 

let accessWechat = async function(ctx,next) {
    let wechat = new Wechat(config)
    let token = config.token,
        signature = ctx.query.signature,
        nonce = ctx.query.nonce,
        timestamp = ctx.query.timestamp,
        echostr = ctx.query.echostr;
    let str = [token,timestamp,nonce].sort().join('')
    let sha = sha1(str)
    if(sha!=signature) {
        return next()
    }

    if (ctx.method==='GET') {
        ctx.body = echostr + '' // 接入验证
    } else if (ctx.method==='POST') {
        let message = formatJson(ctx.request.body.xml) // format xml 
        await reply(ctx,message) // 业务层处理逻辑
    }
}

module.exports = accessWechat
