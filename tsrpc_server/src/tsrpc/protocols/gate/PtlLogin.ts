/*
 * @Author: dgflash
 * @Date: 2022-06-23 09:36:16
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:05:45
 */
/** 登录请求信息 */
export interface ReqLogin {
    /** 用户名 */
    username: string
}

/** 开始匹配响应信息 */
export interface ResLogin {
    /** 玩家唯一标识 */
    key: number;
}