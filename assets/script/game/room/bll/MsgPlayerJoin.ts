/*
 * @Author: dgflash
 * @Date: 2022-05-13 14:04:06
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:42:35
 */
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerJoin } from "../../../tsrpc/protocols/room/server/MsgPlayerJoin";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Room } from "../Room";
import { RoomUtil } from "./RoomUtil";

/** 其它玩家加入房间 */
@ecs.register('MsgPlayerJoin')
export class MsgPlayerJoinComp extends ecs.Comp {
    data: MsgPlayerJoin[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerJoinSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerJoinComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/PlayerJoin`, v => {
            e.get(MsgPlayerJoinComp).data.push(v);
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerJoinComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            data.forEach(d => {
                e.RoomModel.vm.playerNum++;

                if (!e.RoomModel.players.has(d.playerInfo.id)) {
                    let player = RoomUtil.playerCreate(d.playerInfo);
                    if (player) {
                        player.load(smc.scene.MapModel.game.node, (node: Node) => {
                            RoomUtil.playerInited(player, d.pos, d.rotation);
                            Logger.logBusiness(`【房间】加入 - ${player.RoleModel.nickname}`);
                        });
                    }
                }
            });
        }
    }
}