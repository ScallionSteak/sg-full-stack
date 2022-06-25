/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:58:40
 */

/** 创建房间请求信息 */
export interface ReqRoomCreate {
    /** 房间名 */
    roomName: string
}

/** 创建房间响应信息 */
export interface ResRoomCreate {
    /** 房间服务器地址 */
    serverUrl: string,
    /** 房间编号 */
    roomId: string
}