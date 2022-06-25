/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-16 14:45:49
 */
import { BaseConf } from "../../base"

/** 创建房间请求数据 */
export interface ReqRoomCreate {
    /** 管理员授权码 */
    adminToken: string,
    /** 房间名 */
    roomName: string
}

/** 创建房间反回数据 */
export interface ResRoomCreate {
    /** 房间编号 */
    roomId: string
}

/** 暂未使用 */
export const conf: BaseConf = {
    /** 允许游客 */
    allowGuest: true
}