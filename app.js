'use strict'
const path = require('path')
const Koa = require('koa')
const app = new Koa()

const bodyParser = require('koa-bodyparser') // request的body解析
const xmlParser = require('koa-xml-body')
const config = require('./config').wechat.base

app.use(xmlParser())
app.use(bodyParser())

const accessWechat = require('./server/services/wechat/access') // 微信middle
app.use(accessWechat)

const routes = require('./server/controllers/routes') // 注册路由
app.use(routes( path.join(__dirname,'server','routes') ))

app.listen(config.port) 
console.log(`app started at port ${config.port}`)