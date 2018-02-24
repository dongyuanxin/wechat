'use strict'
const Koa = require('koa')
const app = new Koa()

const bodyParser = require('koa-bodyparser') // request的body解析
const xmlParser = require('koa-xml-body')
const config = require('./config/wechat')

app.use(xmlParser())
app.use(bodyParser())

const accessWechat = require('./wechat/access') // 微信middle
app.use(accessWechat)

const index = require('./index') // 注册路由
app.use(index())

app.listen(config.port) 
console.log(`app started at port ${config.port}`)