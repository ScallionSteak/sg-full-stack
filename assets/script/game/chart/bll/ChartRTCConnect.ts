/*
 * @Author: Nicodemus
 * @Date: 2022-08-05 18:55:00
 * @LastEditors: Nicodemus
 * @LastEditTime: 2022-08-05 18:55:00
 */

import { ChartRTCInfo, ChartRTCConnectInfo } from '../model/ChartRTCInfo';

export class ChartRTCConnect {
    static connect(params: ChartRTCInfo) {
        let info: ChartRTCConnectInfo = {
            type: 'rtc-connect',
            rtc: params,
        };
        window.postMessage(info);
        console.log('---- ChartRTCConnect - connect:\t', info);
    }
    static disconnect(params: ChartRTCInfo) {
        let info: ChartRTCConnectInfo = {
            type: 'rtc-disconnect',
            rtc: params,
        };
        window.postMessage(info);
    }
}
