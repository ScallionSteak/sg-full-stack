/*
 * @Author: dgflash
 * @Date: 2022-05-13 15:42:58
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:44:36
 */

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { PlayerInfo } from "../../../tsrpc/types/PlayerInfo";
import { PlayerPosition, PlayerRotation } from "../../../tsrpc/types/PlayerState";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Role } from "../../role/Role";

export class RoomUtil {
    /** 添加玩家数据到房间中 */
    static playerCreate(d: PlayerInfo): Role {
        let player = ecs.getEntity<Role>(Role);
        player.RoleModel.id = d.id;
        player.RoleModel.nickname = d.nickname;

        // 准备初始化的玩家对象
        smc.room.RoomModel.players.set(player.RoleModel.id, player);

        return player;
    }

    /** 初始化完成，把实始化列表的玩家移除，并转到玩家列表中 */
    static playerInited(player: Role, pos: PlayerPosition, rotation: PlayerRotation) {
        player.RoleView.node.setPosition(pos.x, pos.y, pos.z);
    }
}