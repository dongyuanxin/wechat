'use strict'
/**
 * status:0 成功
 * status:1 接口次数到达最大
 * status:2 服务器压力过大
 */
const {query} = require('./../../../database/mysql')

function Database(){
    this.query = query
}

Database.prototype.createUser =async function(username) { // 为新用户创建记录
    let sql = `INSERT INTO godbmw SET ?;`
    let post = {
        user_name : username,
        weather_times : 0,
        chat_times : 0
    }
    try{
        await this.query(sql,post)
        console.log('Create log for '+username)
    }catch(err) {
        console.log(`Mysql error at ${username} when ${sql}`)
    }
}

Database.prototype.checkTimes =async function(username,tag){ // 检查用户每日的接口次数是否到达到上限
    let results = '',sql = 'SELECT * FROM godbmw WHERE user_name=?;'
    try{
        results = await this.query(sql,[username])
        if( results.length ===null || results.length === undefined || results.length === 0 || results.length === '0') { // 如果用户不存在
            this.createUser(username) // 创建记录
            return  {status:0}
        }
        let { weather_max_times,weather_times,chat_max_times,chat_times } = results[0] // 针对不同的功能查找对应是否到达最大权限
        if(tag ==='weather') {
            if(weather_times >= weather_max_times ) return ( { status:1} ) 
            return  ( {status:0} )
        } else if (tag === 'chat') {
            if(chat_times >= chat_max_times ) return ( {status:1} )
            return  ( {status:0} )
        }
    } catch(err) {
        console.error(err)
        return {status:2}
    }
}

Database.prototype.updateTimes =async function(username,tag) {
    let sql = `UPDATE godbmw SET ${tag}_times = ${tag}_times+1 WHERE user_name = ? ;`
    try{
        await this.query(sql,[username])
    } catch(err) {
        console.log(`Mysql error at ${username} when "${sql}"`)
    }
}

// 每日回滚数据库，更新times
Database.prototype.rollbackTimes =async function(){
    let sql = 'UPDATE godbmw SET weather_times=0, chat_times=0;'
    let that = this
    try{
        await this.query(sql)
        console.log('Callback success today')
    } catch(err) {
        console.log('Callback fail , try again after 3600 seconds')
        setTimeout(that.rollbackTimes,1000 * 3600)
    }
}

exports = module.exports = Database
