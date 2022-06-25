/*
 * @Author: dgflash
 * @Date: 2022-05-05 17:20:19
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 17:43:24
 */
import { Collection, Db, MongoClient, OptionalId } from "mongodb";
import { DbCollectionName, DbCollectionType, DbInit } from "./DbCollection";

export class MongoDB {
    static db: Db;

    /** 实始化 mongodb 数据库 */
    static async init() {
        // const url = 'mongodb+srv://dgflash:G0sWT97F22cStkH5@cluster0.s2h5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const url = 'mongodb://localhost:27017/';
        const client = await new MongoClient(url).connect();        // 连接数据库
        this.db = client.db("oops-framework");                      // 打开数据库

        // 初始化数据表
        await DbInit.create();
    }

    /** 连接数据库表 */
    static collection<T extends keyof DbCollectionType>(col: T): Collection<OptionalId<DbCollectionType[T]>> {
        return this.db.collection(col);
    }

    /** 数据表是否存在 */
    static collectionExist(name: string) {
        return new Promise((resolve: Function, reject: Function) => {
            this.db.listCollections({ name }).next((err, collinfo) => {
                if (collinfo) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * 获取指定数据表的自增量
     * @param name 
     * @returns 
     */
    static getNextSequenceValue(name: string): Promise<number> {
        return new Promise((resolve: Function, reject: Function) => {
            var conters = this.db.collection(DbCollectionName.counters);
            conters.findOneAndUpdate(
                { key: name },
                { $inc: { value: 1 } },
                async (err, response) => {
                    if (err) throw err;

                    // 没有指定配置表自增量记录
                    if (response) {
                        if (response.value == null) {
                            await conters.insertOne({
                                key: name,
                                value: 1
                            });

                            resolve(await this.getNextSequenceValue(name));
                        }
                        else {
                            resolve(response.value.value);
                        }
                    }
                });
        });
    }
}