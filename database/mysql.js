'use strict'
const mysql = require('mysql')
const config = require('./../config').database.mysql
const pool = mysql.createPool(config)

let query = function(sql,values) {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err) {
                reject(err)
            } else {
                connection.query(sql,values,(err,rows)=>{
                    if(err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
exports = module.exports = {query}
