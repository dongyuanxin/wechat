'use strict'
const sha1 = require('sha1')
const Wechat = require('./wechat') 
const path = require('path')
const {formatJson} = require(path.join(__dirname,'..','utils','util.js'))
const {reply} = require('./reply')

const config = require('../config/wechat')

let wechatApi = new Wechat(config)

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