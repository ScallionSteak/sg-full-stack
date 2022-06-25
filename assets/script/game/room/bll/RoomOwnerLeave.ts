/*
 * @Author: dgflash
 * @Date: 2022-05-12 19:29:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:44:20
 */
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { UIID } from "../../common/config/GameUIConfig";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Room } from "../Room";
import { RoomNetMsgComp } from "./RoomNetMsg";

/** 自己离开房间后续逻辑 */
@ecs.register('RoomOwnerLeave')
export class RoomOwnerLeaveComp extends ecs.Comp {
    reset(): void { }
}

export class RoomOwnerLeaveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomOwnerLeaveComp);
    }

    entityEnter(e: Room): void {
        e.remove(RoomNetMsgComp);

        // 清理地图上的玩家
        let players = e.RoomModel.players;
        players.forEach(r => {
            r.destroy();
        });

        // 房间数据清理
        e.RoomModel.reset();

        // 卸载地图
        smc.scene.unload();

        // 后续修改：需要在这里添加转到下一个地图的逻辑 调用
        // smc.room.join("", "", e.RoomModel.playerName);

        // // 打开匹配界面
        // oops.gui.open(UIID.Demo_Match);

        // // 关闭角色只界面
        // oops.gui.remove(UIID.Demo_Role_Controller);

        e.remove(RoomOwnerLeaveComp);

        Logger.logBusiness("【房间】自己离开");
    }
}