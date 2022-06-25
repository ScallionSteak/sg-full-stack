/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:55:36
 */
import { PlayerInfo } from "../../../types/PlayerInfo";

/** 服务器通知客户端离开房间 */
export interface MsgPlayerLeave {
    /** 离开房间时间 */
    time: Date,
    /** 离开房间的玩家信息 */
    playerInfo: PlayerInfo
}