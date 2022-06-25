/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-31 17:00:58
 */

import { PlayerPosition, PlayerRotation } from "./PlayerState"

/** 房间中玩家状态 */
export interface RoomPlayerState {
    /** 玩家编号 */
    uid: string
    /** 玩家位置 */
    pos: PlayerPosition
    /** 玩家旋转信息 */
    rotation: PlayerRotation
    /** 玩家动作（暂不需要使用） */
    action: string
}