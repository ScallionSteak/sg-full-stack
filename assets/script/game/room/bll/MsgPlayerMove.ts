/*
 * @Author: dgflash
 * @Date: 2022-05-16 18:38:07
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:42:52
 */

import { v3 } from "cc";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerMove } from "../../../tsrpc/protocols/room/server/MsgPlayerMove";
import { Room } from "../Room";

/** 玩家游戏状态同步 */
@ecs.register('MsgPlayerMove')
export class MsgPlayerMoveComp extends ecs.Comp {
    data: MsgPlayerMove[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerMoveComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/PlayerMove`, v => {
            e.get(MsgPlayerMoveComp).data.push(v);
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerMoveComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            data.forEach(d => {
                let player = e.RoomModel.players.get(d.state.uid);
                if (player && player != e.RoomModel.owner && player.RoleView) {
                    if (d.state.target) {
                        // 点击移动
                        // let pos = v3(d.state.target.x, d.state.target.y, d.state.target.z);
                        // player.RoleView.moveTouch(pos);
                    }
                    else {
                        if (d.state.action) {
                            player.RoleView.moveJoystick(d.state);
                        }
                        else {
                            player.RoleView.idle();
                        }
                    }
                }
            });
        }
    }
}