/*
 * @Author: dgflash
 * @Date: 2022-06-23 16:32:28
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 17:40:16
 */

import { sg } from "../../ServerGate";
import { DbUser } from "./DbUser";
import { MongoDB } from "./MongoDB";

/** 数据表名 */
export enum DbCollectionName {
    /** 自增量记录表 */
    counters = "counters",
    /** 用户表 */
    user = "user",
}

/** 数据库表类型 */
export interface DbCollectionType {
    user: DbUser
}

export class DbInit {
    /** 初始化数据库 */
    static async create() {
        return new Promise(async (resolve: Function, reject: Function) => {
            for (var name in DbCollectionName) {
                if (!await MongoDB.collectionExist(name)) {
                    sg.GateModel.hs.logger.log(`创建[${name}]表`);
                    await MongoDB.db.createCollection(name);
                }
            }
            resolve();
        });
    }
}