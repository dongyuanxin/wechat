'use strict'
const https = require('https')
const fs = require('fs')
const path = require('path')
const request = require('request')
const rp = require('request-promise')
const _ = require('lodash')

const Chat = require('./../plugins/chat')
const Weather = require('./../plugins/weather')
const Mysql = require('./../../models/mysql')

const chatApi = new Chat()
const weatherApi = new Weather()
const mysqlApi = new Mysql()
const accessTokenPath = path.join(__dirname,'..','..','..','config','wechat','access_token.txt')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken:prefix + 'token?grant_type=client_credential'
}

function Wechat(config) {
    this.appID = config.appID
    this.appSecret = config.appSecret
    this.fetchAcessToken()
}

Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    let access_token = data.access_token
    let expires_in = data.expires_in
    let now = new Date().getTime()
    return now < expires_in?true:false
}

Wechat.prototype.updateAccessToken = function() {
    let appID = this.appID
    let appSecret = this.appSecret
    const url = api.accessToken + `&appid=${appID}&secret=${appSecret}`
    return new Promise((resolve,reject)=>{
        https.get(url,(res)=>{
            res.on('data',(d)=>{
                let data = JSON.parse(d.toString())
                let now = new Date().getTime()
                let expires_in = now + (data.expires_in - 20)*1000
                data.expires_in = expires_in
                resolve(data)
            })
        }).on('error',()=>{
            reject(new Error("Error at getting access token"))
        })
    })
}

Wechat.prototype.getAccessToken = function(){
    return new Promise((resolve,reject)=>{
        fs.readFile(accessTokenPath,'utf-8',(err,content)=>{
            if (err) reject(err)
            else resolve(content)
        })
    })
}

Wechat.prototype.saveAccessToken = function(content){
    return new Promise((resolve,reject)=>{
        fs.writeFile(accessTokenPath,content,(err)=>{
            if (err) reject(err)
            else resolve()
        })
    })
}

Wechat.prototype.fetchAcessToken = function() {
    let that = this
    if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
        return Promise.resolve({
            access_token:this.access_token,
            expires_in:this.expires_in
        })
    }
    // 注意：return Promise
    return this.getAccessToken().then(function(data){
        try{
            data = JSON.parse(data)
        } catch(error) {
            return that.updateAccessToken()
        }
        if (that.isValidAccessToken(data)) {
            return Promise.resolve(data)
        } else {
            return that.updateAccessToken()
        }
    }).then(function (data){
        that.access_token = data.access_token
        that.expires_in = data.expires_in
        that.saveAccessToken(JSON.stringify(data))
        return Promise.resolve(data)
    })
}

Wechat.prototype.chat = async function(userName,msg) {
    let result = '',response = ''
    try{
        response = await mysqlApi.checkTimes(userName,'chat')
    } catch (err) { 
        console.error(err) 
        return '不好意思，服务器压力过大，请稍后再试'
    }
    if (response.status===0) {
        try{
            result = await chatApi.qingYunKe(msg)
            mysqlApi.updateTimes(userName,'chat')
            return result
        } catch(err) {
            console.error(err)
            return  '不好意思，服务器压力过大，请稍后再试'
        }
    } else if (response.status === 1) {
        return '不好意思，考虑到服务器压力。您今天的智能聊天次数已达上限。\n更多请回复:\'帮助\'或\'help\''
    } else {
        return '不好意思，服务器压力过大，请稍后再试'
    }
}

Wechat.prototype.fetchNowWeather =async function(message){
    let label = message.Label,
        locX = message.Location_X,
        locY = message.Location_Y,
        response = ''
    try{
        response = await mysqlApi.checkTimes(message.FromUserName,'weather')
    } catch(err) {
        console.error(err)
        return '不好意思，服务器压力过大，请稍后再试'
    }
    if(response.status === 0){
        try{
            let result = '地理位置 ' + label + '\n' + await weatherApi.fetchNow(locY + ',' + locX)
            mysqlApi.updateTimes(message.FromUserName,'weather')
            return result
        } catch(err) {
            console.error(err)
            return '不好意思，服务器压力过大，请稍后再试'
        }
    } else if (response.status=== 1){
        return '不好意思，考虑到服务器压力。您今天的天气查询次数已达上限。\n更多请回复:\'帮助\'或\'help\''
    } else {
        return '不好意思，服务器压力过大，请稍后再试'
    }
}

module.exports = Wechat 
