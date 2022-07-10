/*
 * @Author: dgflash
 * @Date: 2022-05-12 19:32:02
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:42:19
 */

import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgChat } from "../../../tsrpc/protocols/room/server/MsgChat";
import { Room } from "../Room";

/** 房间内聊天 */
@ecs.register('MsgPlayerChat')
export class MsgPlayerChatComp extends ecs.Comp {
    data: MsgChat[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerChatSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerChatComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/Chat`, v => {
            e.get(MsgPlayerChatComp).data.push(v);
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerChatComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            let curUserName = localStorage.getItem('username');
            console.log(data);
            data.forEach(d => {
                // 后续修改点：把下面这句换成聊天记录显示组件
                // oops.gui.toast(`${d.playerInfo.nickname}:${d.content}`);
                console.log("nickname is ---", d.playerInfo.nickname);
                if(d.playerInfo.nickname == curUserName) {
                    var fromSelf = true;
                } else {
                    var fromSelf = false;
                }
                oops.gui.singleChat(`${curUserName}`, `${d.content}`, fromSelf);
            });
        }
    }
}