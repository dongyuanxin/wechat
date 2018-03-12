'use strict'
const mysql = require('mysql')
let config = require('./../config/database').mysql

function handleError (err) {
    if (err) {
        console.log(err.toString())
        console.log(err.code)
        if (err.code === 'PROTOCOL_CONNECTION_LOST' ||  err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ETIMEDOUT') {
            console.log("链接断开错误，重新连接")
            connect() // 断开连接
        }
        else{
            console.log("其他数据库错误")
            console.error('MySQL CONNECTION ERROR\n' + err.stack || err)
        }
    }
}

function handleClose(err){
    console.log('MySQL CONNECTION CLOSED')
}

function connect(){
    let db = mysql.createPool(config)
    // db.connect(function(err) {
    //     if(err) console.log('MYSQL CONNECT ERROR ' + err)
    //     else console.log('MYSQL CONNECT SUCCESS')
    // })
    db.on('error', err => handleError(err))
    db.on('close', err => handleClose(err))
    module.exports.db = db
    return module.exports.db
}

connect()
