/*
 * @Author: dgflash
 * @Date: 2022-05-16 14:42:13
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-20 23:16:27
 */
import { ApiCall } from "tsrpc";
import { ReqRoomLeave, ResRoomLeave } from "../../../tsrpc/protocols/room/PtlRoomLeave";
import { RoomConnection } from "../model/ServerRoomModelComp";

/** 请求离开房间 */
export async function ApiRoomLeave(call: ApiCall<ReqRoomLeave, ResRoomLeave>) {
    const conn = call.conn as RoomConnection;
    if (conn.room) {
        conn.player.leave();
    }

    call.succ({});
}