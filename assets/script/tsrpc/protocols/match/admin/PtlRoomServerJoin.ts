/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:00:51
 */

/** 加入房间服务器进入工作状态请求数据 */
export interface ReqRoomServerJoin {
    /** 房间服务器 WebSocket 地址 */
    serverUrl: string,
    /** Token 用于鉴权 */
    adminToken: string
}

/** 加入房间服务器进入工作状态响应数据 */
export interface ResRoomServerJoin {

}