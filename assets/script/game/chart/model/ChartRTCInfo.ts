/*
 * @Author: Nicodemus
 * @Date: 2022-08-05 18:55:00
 * @LastEditors: Nicodemus
 * @LastEditTime: 2022-08-05 18:55:00
 */

/** 音视频RTC连接需要的信息(当前使用声网的sdk实现) */
export interface ChartRTCInfo {
    appid: string;
    channel: string;
    token?: string;
    uid?: string | number | null;
}

export interface ChartRTCConnectInfo {
    type: string;
    rtc: ChartRTCInfo;
}
