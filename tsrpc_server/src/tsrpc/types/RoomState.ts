/*
 * @Author: dgflash
 * @Date: 2022-05-16 12:00:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 18:16:08
 */
import { uint } from "tsrpc-proto";

/** 与匹配服务器同步的房间数据 */
export interface RoomState {
    /** 房间编号 */
    id: string,
    /** 房间名 */
    name: string,
    /** 房间当前用户数量 */
    playerNum: uint,
    /** 房间最大用户数量 */
    playerMax: uint,
    /** 房间信息的最后更新时间 */
    timeUpdate: uint,
    /** 为 undefined 代表不在匹配中 */
    timeStartMatch?: uint
}