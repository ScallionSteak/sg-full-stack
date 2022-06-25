/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:58:04
 */
import { uint } from "tsrpc-proto";

/** 在线房间列表请求信息 */
export interface ReqRoomList {

}

/** 在线房间列表响应信息 */
export interface ResRoomList {
    /** 房间列表 */
    rooms: {
        /** 房间名 */
        name: string,
        /** 当前玩家数量 */
        playerNum: uint,
        /** 最大玩家数量 */
        playerMax: uint,
        /** 房间服务器地址 */
        serverUrl: string,
        /** 房间编号 */
        roomId: string
    }[]
}