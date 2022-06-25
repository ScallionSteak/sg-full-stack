/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 17:57:13
 */

/** 房间服务器授权请求信息 */
export interface ReqAuth {
    adminToken: string,
    type: 'MatchServer'
}

/** 房间服务器授权响应信息 */
export interface ResAuth {

}