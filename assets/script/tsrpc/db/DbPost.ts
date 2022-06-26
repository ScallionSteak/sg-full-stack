import { ObjectId } from "mongodb";

/** 数据表 */
export interface DbPost {
    /** 默认主键 */
    _id: ObjectId;
    /** 作者 */
    author: string;
    /** 标题 */
    title: string;
    /** 内容 */
    content: string;
    /** 访问数量 */
    visitedNum: number;

    /** 创建信息 */
    create: {
        uid: string;
        time: Date;
    }
    /** 更新信息 */
    update?: {
        uid: string,
        time: Date
    }
}