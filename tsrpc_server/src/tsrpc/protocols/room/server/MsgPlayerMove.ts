/*
 * @Author: dgflash
 * @Date: 2022-05-17 13:51:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-30 10:32:17
 */
import { PlayerMove as PlayerMove } from "../../../types/PlayerState";

/** 服务器广播玩家控制数据 */
export interface MsgPlayerMove {
    /** 房间控制数据 */
    state: PlayerMove
}