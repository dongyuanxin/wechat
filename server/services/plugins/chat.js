'use strict'
const rp = require('request-promise')

const api = {
    qingYunKe:'http://api.qingyunke.com/api.php?key=free&appid=0'
}

const faceRe = /\{face.*?\}/g // 过滤掉 青云客 平台的表情符号
// const faceRe = /\{face.*?\}/gs //node 9.5 可以

function Chat(){}

Chat.prototype.qingYunKe = function(msg){
    let uri = api.qingYunKe + `&msg=${encodeURI(msg)}`
    return new Promise(function(resolve,reject){
        let options = {
            uri,
            method:"GET"
        }
        rp(options).then(function(body){
            let res = JSON.parse(body)
            if(res.result===0) resolve(res.content.replace(faceRe,'') + ' ') // 不能发送空白消息
            else reject('Error in qingYunKe function at chat.js')
        }).catch(function(err){
            console.error(err)
            reject('Error in qingYunKe function at chat.js')
        })
    })
}

exports = module.exports = Chat
