/*
 * @Author: dgflash
 * @Date: 2022-05-12 19:29:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:42:47
 */
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerLeave } from "../../../tsrpc/protocols/room/server/MsgPlayerLeave";
import { Room } from "../Room";

/** 其它玩家离开房间 */
@ecs.register('MsgPlayerLeave')
export class MsgPlayerLeaveComp extends ecs.Comp {
    data: MsgPlayerLeave[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerLeaveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerLeaveComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/PlayerLeave`, v => {
            e.get(MsgPlayerLeaveComp).data.push(v);
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerLeaveComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            data.forEach(d => {
                e.RoomModel.vm.playerNum--;

                var role = e.RoomModel.players.get(d.playerInfo.id);
                if (role) {
                    Logger.logBusiness(`【房间】离开 - ${role.RoleModel.nickname}`);
                    e.RoomModel.players.delete(d.playerInfo.id);
                    role.destroy();
                }
            });
        }
    }
}