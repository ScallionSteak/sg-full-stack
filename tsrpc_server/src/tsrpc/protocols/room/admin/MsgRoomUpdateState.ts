/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 18:17:51
 */

import { RoomState } from "../../../types/RoomState";

/** 更新房间状态信息 */
export interface MsgRoomUpdateState {
    /** 房间数组 */
    rooms: RoomState[];
}