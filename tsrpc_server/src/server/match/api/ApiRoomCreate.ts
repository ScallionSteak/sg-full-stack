import { ApiCall } from "tsrpc";
import { ReqRoomCreate, ResRoomCreate } from "../../../tsrpc/protocols/match/PtlRoomCreate";
import { MatchUtil } from "../bll/MatchUtil";

/** 创建一个新房间 */
export async function ApiRoomCreate(call: ApiCall<ReqRoomCreate, ResRoomCreate>) {
    if (!call.req.roomName) {
        return call.error('请输入房间名称');
    }

    let ret = await MatchUtil.createRoom(call.req.roomName);
    ret.isSucc ? call.succ(ret.res) : call.error(ret.err)
}