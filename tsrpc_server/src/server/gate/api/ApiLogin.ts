/*
 * @Author: dgflash
 * @Date: 2022-06-23 09:38:35
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:05:02
 */
import { ApiCall } from "tsrpc";
import { DbCollectionName } from "../../../module/mongodb/DbCollection";
import { MongoDB } from "../../../module/mongodb/MongoDB";
import { ReqLogin, ResLogin } from "../../../tsrpc/protocols/gate/PtlLogin";

/** 玩家登录处理 */
export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {
    var cUser = MongoDB.collection(DbCollectionName.user);
    var query = await cUser.findOne({ username: call.req.username });
    if (query) {
        call.succ({ key: query.key });
    }
    else {
        call.error(`用户名[${call.req.username}]不存在`, { code: 'Exist_No_UserName' });
    }
}