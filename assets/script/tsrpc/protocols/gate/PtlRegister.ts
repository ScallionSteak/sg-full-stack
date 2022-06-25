/*
 * @Author: dgflash
 * @Date: 2022-06-23 11:12:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 16:20:22
 */
/** 用户注册请求 */
export interface ReqRegister {
    /** 用户名 */
    username: string
}

/** 用户注册应响应 */
export interface ResRegister {
    key: number
}
