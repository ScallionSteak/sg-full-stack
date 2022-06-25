/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 17:42:47
 */

/** 用户表数据结构 */
export interface DbUser {
    /** 自增量唯一标识 */
    key: number,
    /** 用户名 */
    username: string,
    /** 创建时间 */
    createtime: Date
}