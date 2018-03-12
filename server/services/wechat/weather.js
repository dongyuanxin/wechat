'use strict'

const crypto = require('crypto')
const querystring = require('querystring')
const fs = require('fs')
const rp = require('request-promise')
const config = require('./../../../database/mysql').db

const api = {
    now:{
        free:'https://free-api.heweather.com/s6/weather/now?'
    }
}

function Weather(){
    this.username = config.username
    this.key = config.key
}

Weather.prototype.transNow = function(body) {
    let now = body.HeWeather6[0].now
    let cond_txt = now.cond_txt, // 天气状况
        fl = now.fl, // 体感温度
        tmp = now.tmp, // 温度
        hum = now.hum, // 相对湿度 
        pcpn = now.pcpn, // 降水量
        wind_spd = now.wind_spd, // 风速
        vis = now.vis // 能见度
    return `天气状况 ${cond_txt}
体感温度 ${fl}
温度 ${tmp}
相对湿度 ${hum}
降水量 ${pcpn}
风速 ${wind_spd}
能见度 ${vis}`
}
Weather.prototype.getSign = function(params){
    let keys = Object.keys(params).sort()
    let canstring = ''
    for(let key of keys) {
        canstring += (key + '=' + params[key] + '&')
    }
    canstring = canstring.substr(0,canstring.length-1)
    canstring += this.key
    let md5 = crypto.createHash('md5')
    md5.update(canstring)
    return md5.digest('base64')
}

Weather.prototype.fetchNow = function(location) {
    let params = {
        location,
        username:this.username,
        t:(new Date()).getTime()/1000
    }
    params.sign = this.getSign(params)
    let nowUrl = api.now.free + querystring.stringify(params)
    return new Promise((resolve,reject)=>{
        let options = {
            method:'GET',
            uri:nowUrl,
            json:true
        }
        rp(options).then(body=>{
            let res = this.transNow(body)
            resolve(res)
        }).catch(err=>{
            reject('查询功能测试中')
        })
    })
}

module.exports = Weather