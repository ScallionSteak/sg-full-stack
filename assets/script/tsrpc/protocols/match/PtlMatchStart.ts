/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:59:43
 */

/** 开始匹配请求信息 */
export interface ReqMatchStart {

}

/** 开始匹配响应信息 */
export interface ResMatchStart {
    /** 房间服务器地址 */
    serverUrl: string,
    /** 房间编号 */
    roomId: string
}