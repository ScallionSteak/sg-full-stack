/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 16:42:08
 */
import { ApiCall } from "tsrpc";
import { sr } from "../../../../ServerRoom";
import { ReqAuth, ResAuth } from "../../../../tsrpc/protocols/room/admin/PtlAuth";

/** 加入匹配服务器成功 */
export async function ApiAuth(call: ApiCall<ReqAuth, ResAuth>) {
    sr.auth(call);
}