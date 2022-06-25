/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:56:10
 */
import { PlayerInfo } from "../../../types/PlayerInfo"
import { PlayerPosition, PlayerRotation } from "../../../types/PlayerState"

/** 服务器通知客户端加入房间 */
export interface MsgPlayerJoin {
    /** 加入房间时间 */
    time: Date,
    /** 加入房间的玩家信息 */
    playerInfo: PlayerInfo,
    /** 加入房间时玩家位置 */
    pos: PlayerPosition,
    /** 加入房间时玩家方向 */
    rotation: PlayerRotation
}