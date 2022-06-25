/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-16 14:51:44
 */
import { ApiReturn, TsrpcError } from "tsrpc";
import { Config } from "../../../module/config/Config";
import { sm } from "../../../ServerMatch";
import { ResRoomCreate } from "../../../tsrpc/protocols/match/PtlRoomCreate";

export class MatchUtil {
    /** 创建房间 */
    static async createRoom(roomName: string): Promise<ApiReturn<ResRoomCreate>> {
        var rooms = sm.MatchModel.rooms;

        // 挑选一个人数最少的房间服务器
        let roomServer = rooms.filter(v => v.state).orderBy(v => v.state!.rooms.length)[0];
        if (!roomServer) {
            return { isSucc: false, err: new TsrpcError('没有可用的房间服务器') };
        }

        // RPC -> ServerRoom
        let op = await roomServer.client.callApi(`admin/RoomCreate`, {
            adminToken: Config.adminToken,
            roomName: roomName
        });

        if (!op.isSucc) {
            return { isSucc: false, err: new TsrpcError(op.err) };
        }

        return {
            isSucc: true,
            res: {
                roomId: op.res.roomId,
                serverUrl: roomServer.url
            }
        }
    }
}