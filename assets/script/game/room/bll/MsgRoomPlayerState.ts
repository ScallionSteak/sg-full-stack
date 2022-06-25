/*
 * @Author: dgflash
 * @Date: 2022-05-18 09:57:57
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 17:03:24
 */
import { Vec3 } from "cc";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Room } from "../Room";

/** 
 * 玩家状态同步逻辑 
 * 1、验证数据正确性
 */
@ecs.register('MsgRoomPlayerState')
export class MsgRoomPlayerStateComp extends ecs.Comp {
    reset(): void { }
}

export class MsgRoomPlayerStateSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgRoomPlayerStateComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/RoomPlayerState`, v => {
            for (let uid in v.states) {
                let us = v.states[uid];
                if (uid != smc.room.RoomModel.owner.RoleModel.id) {                                        // 注:自己的状态与服务器的不一样，处理和解逻辑
                    const player = e.RoomModel.players.get(uid);
                    if (player) {
                        const rv = player.RoleView;
                        if (Vec3.squaredDistance(rv.node.position, us.pos) > 100) {
                            // 缓动移动到与服务器同步的位置
                            player.RoleView.moveTween(us.pos);

                            // 旋转到与服务器同步的角度
                            rv.node!.setRotation(us.rotation.x, us.rotation.y, us.rotation.z, us.rotation.w);
                        }
                    }
                }
            }
        });
    }
}