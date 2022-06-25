/*
 * @Author: dgflash
 * @Date: 2022-06-23 17:48:28
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 18:47:19
 */
import { ApiCall } from "tsrpc";
import { sg } from "../../../ServerGate";
import { ReqGameArea, ResGameArea } from "../../../tsrpc/protocols/gate/PtlGameArea";

/** 获取游戏分区信息与分区服务器地址 */
export async function ApiGameArea(call: ApiCall<ReqGameArea, ResGameArea>) {
    call.succ(sg.GateModel.area);
}