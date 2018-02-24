'use strict'
var error = async(ctx,next)=>{
    ctx.response.body = '<center><h1>请使用微信登陆</h1></center>'
}

module.exports = {
    'GET /':error,
    'POST /':error
}