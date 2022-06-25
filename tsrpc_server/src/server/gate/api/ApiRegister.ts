/*
 * @Author: dgflash
 * @Date: 2022-06-23 11:12:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 17:41:52
 */
import { ApiCall } from "tsrpc";
import { DbCollectionName } from "../../../module/mongodb/DbCollection";
import { MongoDB } from "../../../module/mongodb/MongoDB";
import { ReqRegister, ResRegister } from "../../../tsrpc/protocols/gate/PtlRegister";

/** 用户注册 */
export async function ApiRegister(call: ApiCall<ReqRegister, ResRegister>) {
    // 创建用户表自增量唯一表示
    var key = await MongoDB.getNextSequenceValue(DbCollectionName.user);
    var cUser = MongoDB.collection(DbCollectionName.user);
    var query = await cUser.findOne({ username: call.req.username });
    if (query == null) {
        // 插入用户数据
        await cUser.insertOne({
            key,
            username: call.req.username,
            createtime: new Date()
        });

        // 返回客户端结果
        call.succ({ key });
    }
    else {
        call.error(`注册用户名[${call.req.username}]已存在`, { code: 'Exist_UserName' });
    }
}