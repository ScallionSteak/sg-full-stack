/*
 * @Author: dgflash
 * @Date: 2022-05-05 09:37:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-20 11:38:42
 */
import { uint } from "tsrpc-proto";
import { PlayerInfo } from "./PlayerInfo";
import { PlayerPosition, PlayerRotation } from "./PlayerState";

/** 房间数据 */
export interface RoomData {
    /** 房间编号 */
    id: string,

    /** 房间名 */
    name: string,

    /** 房间可容纳的最大人数 */
    playerMax: uint,

    /** 房间内的用户 */
    players: (PlayerInfo & { pos: PlayerPosition } & { rotation: PlayerRotation })[],

    /** 上一次空房的时间（undefined 代表房内有人） 用于定时解散无人的房间 */
    timeLastEmpty?: number,

    /** 开始匹配的时间，`undefined` 代表不在匹配中 */
    timeStartMatch?: number,

    /** 房间信息的最后更新时间 */
    timeUpdate: number,

    /** 历史聊天信息（只保留最近的 N 条） */
    messages: {
        time: Date,
        playerInfo: PlayerInfo,
        content: string
    }[]
}