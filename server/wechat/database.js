'use strict'
/**
 * status:0 成功
 * status:1 接口次数到达最大
 * status:2 服务器压力过大
 */
const db = {
    mysql: require('./../db/mysql').db
}

function Database(){
    this.mysql = db.mysql
}

Database.prototype.createUser = function(username) { // 为新用户创建记录
    let sql = `INSERT INTO godbmw SET ?;`
    let post = {
        user_name : username,
        weather_times : 0,
        chat_times : 0
    }
    this.mysql.query(sql, post ,(err,results)=>{
        if (err) console.log(`Mysql error at ${username} when ${sql}`)
        else console.log('Create log for '+username)
    })
}

Database.prototype.checkTimes = function(username,tag){ // 检查用户每日的接口次数是否到达到上限
    let that = this
    const pm =  new Promise(function(resolve,reject) {
        let sql = 'SELECT * FROM godbmw WHERE user_name=?;'
        that.mysql.query(sql,[username],(err,results)=>{
            // 必须return，因为只是改变Promise 状态
            // 但是依旧会向下执行
            if(err){
                console.log('IN wechat Database.js')
                console.error(err)
                return reject({status:2})
            }
            if( results.length ===null || results.length === undefined || results.length === 0 || results.length === '0') { // 如果用户不存在
                that.createUser(username) // 创建记录
                return resolve( {status:0} ) 
            }
            let { weather_max_times,weather_times,chat_max_times,chat_times } = results[0] // 针对不同的功能查找对应是否到达最大权限
            if(tag ==='weather') {
                if(weather_times >= weather_max_times ) resolve({ status:1}) 
                else resolve( {status:0} )
            } else if (tag === 'chat') {
                if(chat_times >= chat_max_times ) resolve( {status:1} )
                else resolve( {status:0} )
            }
        })
    })
    return pm
}

Database.prototype.updateTimes = function(username,tag) {
    let sql = `UPDATE godbmw SET ${tag}_times = ${tag}_times+1 WHERE user_name = ? ;`
    this.mysql.query(sql,[username],function(err,results){
        if (err) {
            console.log(`Mysql error at ${username} when ${sql}`)
            return
        }
    })
}

// 每日回滚数据库，更新times
Database.prototype.rollbackTimes = function(){
    let sql = 'UPDATE godbmw SET weather_times=0, chat_times=0;'
    let that = this
    this.mysql.query(sql,(err,results) => {
        if (err) { // 每日刷新失败,3600s 后重新刷新
            console.log('Callback fail , try again after 3600 seconds')
            setTimeout(that.rollbackTimes,1000 * 3600)
        } else console.log('Callback success today')
    })
}


exports = module.exports = Database
