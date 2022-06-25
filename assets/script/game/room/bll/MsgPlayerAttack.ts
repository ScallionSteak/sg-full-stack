/*
 * @Author: dgflash
 * @Date: 2022-05-27 16:03:19
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:41:54
 */

import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerAttack } from "../../../tsrpc/protocols/room/server/MsgPlayerAttack";
import { Room } from "../Room";

/** 接受服务器玩家攻击命令 */
@ecs.register('MsgPlayerAttack')
export class MsgPlayerAttackComp extends ecs.Comp {
    data: MsgPlayerAttack[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerAttackSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerAttackComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/PlayerAttack`, v => {
            e.get(MsgPlayerAttackComp).data.push(v);
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerAttackComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            data.forEach(d => {
                let player = e.RoomModel.players.get(d.uid);
                let target = e.RoomModel.players.get(d.targetId);
                if (player && target) {
                    player.RoleModel.target = target;
                    player.RoleView && player.RoleView.attack(d.skillId);

                    Logger.logNet(`${player.RoleModel.nickname}攻击${target.RoleModel.nickname}`)
                }
            });
        }
    }
}