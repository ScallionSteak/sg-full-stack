/*
 * @Author: dgflash
 * @Date: 2022-05-05 09:37:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 19:02:15
 */

/** 服务器配置 */
export const Config = {
    /** 管理员授权码 */
    adminToken: 'oops + tsrpc',
    /** 是否用JSON协议，否则用二进制 */
    json: true,
    /** 证书 */
    certificate: 'nginx',
    /** 本地自签名证书调试HTTPS与WSS */
    localHttpsAndWss: false,
    /** 强制HTTPS */
    https: false,
    /** 强制WSS */
    wss: false,
    /** 匹配服务配置 */
    match: {
        /** 匹配服务默认端口 */
        default_port: 3000,
        /** 匹配日志输出间隔时间 */
        match_interval_logger: 5000,
        /** 执行匹配的间隔 */
        match_interval_start: 5000,
        /** 两个心跳数据包之间的间隔时间（单位：毫秒） */
        room_heartbeat_interval: 5000,
        /** 如果在此期间心跳数据包没有得到回复，连接将被关闭（单位：毫秒） */
        room_heartbeat_timeout: 5000
    },
    /** 房间服务配置 */
    room: {
        /** 是否打印长连接消息日志 */
        logMsg: false,
        /** 房间服务默认端口 */
        default_port: process.env['PORT'] || "3001",
        /** 匹配服务服务器 HTTP 地址 */
        default_match_server_url_http: process.env['SERVER_URL_MATCH'] || 'http://47.241.9.181:3000',                // 如果使用强制 HTTPS，这里的IP要修改为证书中的域名
        /** 匹配服务服务器 WebSocket 地址 */
        default_match_server_url_ws: process.env['SERVER_URL_ROOM'] || `ws://47.241.9.181:${process.env['PORT'] || "3001"}`,                          // 如果使用强制 WSS，这里的IP要修改为证书中的域名
        /** 发送房间状态的间隔时间 */
        update_state_interval: 1000,
        /** 每个房间的最大人数 */
        max_user_num: 10,
        /** 房间空闲时间 */
        empty_time: 300000000000,
        /** 房间主动广播其它玩家状态频率 */
        broadcast_player_state_rate: Math.floor(1000 / 2),
    }
}