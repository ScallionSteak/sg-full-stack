/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:54:11
 */
import { PlayerInfo } from "../../types/PlayerInfo";
import { RoomData } from "../../types/RoomData";
import { BaseRequest, BaseResponse } from "../base";

/** 房间加入请求数据 */
export interface ReqRoomJoin extends BaseRequest {
    /** 玩家昵称 */
    nickname: string,
    /** 房间编号 */
    roomId: string
}

/** 房间加入响应数据 */
export interface ResRoomJoin extends BaseResponse {
    /** 玩家信息 */
    playerInfo: PlayerInfo,
    /** 房间信息 */
    room: RoomData
}