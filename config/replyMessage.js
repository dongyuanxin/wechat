'use strict'
let help = `回复关键词如下( 去掉空格等字符 )：
0 : 技术文档
1 : 最新文章
其他消息系统会开启自动聊天功能，支持文本和语音输入，不支持表情、图片和视频

更多内容请回复 1 来获取`

let more = `技术栈 : Vue + Node + Koa2 + MongoDB + MySql
个人站点 : www.godbmw.com ( 搭建ing )
自动聊天 : 青客云
天气查询 : 和风天气`

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
    help,
    0:more,
    1:passages
}