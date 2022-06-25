/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 18:22:33
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-framework/assets/libs/model-view/ViewModel";
import { Role } from "../../role/Role";

/** 房间显示数据 */
export interface IRoomVM {
    /** 服务器地址 */
    server: string,
    /** 房间名 */
    name: string,
    /** 房间可容纳的最大人数 */
    playerMax: number,
    /** 当前玩家数量 */
    playerNum: number,
    /** 延时 */
    ping: number
}

/** 房间数据 */
@ecs.register('RoomModel')
export class RoomModelComp extends ecs.Comp {
    /** 显示数据 */
    vm: IRoomVM = null!;

    /** 房间编号 */
    roomId: string = null!;
    /** 房间服务器地址 */
    serverUrl: string = null!;
    /** 玩家自己名 */
    playerName: string = null;

    /** 玩家自己 */
    owner: Role = null!;
    /** 房间所有玩家 */
    players: Map<string, Role> = new Map();

    vmAdd() {
        VM.add(this.vm, "Room");
    }

    vmRemove() {
        VM.remove("Room");
        this.vm = null;
    }

    reset(): void {
        this.vmRemove();
        this.roomId = null!;
        this.serverUrl = null!;
        this.playerName = null;
        this.owner = null;
        this.players.clear();
    }
}
