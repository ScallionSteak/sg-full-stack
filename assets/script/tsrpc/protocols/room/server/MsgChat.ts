/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-23 11:14:17
 */
import { PlayerInfo } from "../../../types/PlayerInfo";

/** 服务器广播聊天数据 */
export interface MsgChat {
    /** 发送时间 */
    time: Date,
    /** 玩家信息 */
    playerInfo: PlayerInfo,
    /** 聊天内容 */
    content: string
}