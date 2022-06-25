/*
 * @Author: dgflash
 * @Date: 2022-05-18 09:49:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-23 11:15:22
 */

import { RoomPlayerState } from "../../../types/RoomPlayerState"

/** 房间内所有玩家状态 */
export interface MsgRoomPlayerState {
    /** 房间内所有玩家状态数据 */
    states: {
        [uid: string]: RoomPlayerState
    }
}