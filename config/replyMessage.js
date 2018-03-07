'use strict'
let help = `v1.0版本功能如下
发送微信实时位置：返回 实时天气 数据
发送'help'或'帮助'：返回 帮助文档
发送'author'或'作者'：返回 开发者信息
其他消息：默认开启智能聊天功能（支持语音和文字）
<a href="https://github.com/godbmw/wechat/blob/master/README.md">>>> 查看更多使用说明</a>`

let author = `微信：IT_xxx
QQ：2181111110
<a href="https://github.com/godbmw/">>>> Click to Follow Me</a>`

let passages = [
    {
        title:'(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤',
        description:'来自godbmw的问候',
        picurl:'https://avatars0.githubusercontent.com/u/26399528?s=460&v=4',
        url:'https://github.com/godbmw'
    },
    {
        title:'使用说明',
        description:'更多有趣功能',
        url:'https://github.com/godbmw/wechat/blob/master/README.md'
    }
]

module.exports = {
    author,
    help,
    passages
}