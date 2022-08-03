/*
 * @Author: dgflash
 * @Date: 2022-05-17 11:00:06
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:43:12
 */

import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { Room } from '../Room';
import { RoomOwnerLeaveComp } from './RoomOwnerLeave';

/** 自己创建房间 */
@ecs.register('RoomNetFlow')
export class RoomNetFlowComp extends ecs.Comp {
    reset(): void {}
}

export class RoomNetFlowSystem
    extends ecs.ComblockSystem
    implements ecs.IEntityEnterSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomNetFlowComp);
    }

    async entityEnter(e: Room): Promise<void> {
        let wsc = e.RoomModelNet.wsc;

        // 客户端断开连接后逻辑
        wsc.flows.postDisconnectFlow.push(async (v) => {
            let cnt = 0;
            console.log('websocket断开连接，正在尝试重新连接');
            if (!v.isManual) {
                // 延迟一段时间后重新连接，避免这段时间内网络故障导致重连失败
                await new Promise((rs) => {
                    setTimeout(rs, 2000);
                });
                let resConnect = await wsc.connect();
                if (!resConnect.isSucc) {
                    oops.gui.toast(`网络异常，请您检查网络后刷新页面`);
                    e.add(RoomOwnerLeaveComp);
                    console.log('websocket重新连接失败');
                } else {
                    console.log('websocket重新连接成功');
                }
            }
            return v;
        });

        e.remove(RoomNetFlowComp);
    }
}
