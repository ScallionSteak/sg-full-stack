/*
 * @Author: dgflash
 * @Date: 2022-05-05 17:10:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-17 18:14:15
 */
import { RoomPlayerState } from "../../../types/RoomPlayerState";

/** 接受客户端同步当前状态数据 */
export type MsgPlayerState = Omit<RoomPlayerState, 'uid'>