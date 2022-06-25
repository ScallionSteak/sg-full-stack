/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:46:01
 */
import { ecs } from "../../core/ecs/ECS";
import { EcsPlayerSystem } from "../../module/player/Player";
import { EcsRoomSystem } from "../../module/room/Room";
import { EcsServerRoomSystem } from "./ServerRoom";

/** 房间服务器模块 */
export class ServerRoomSystem extends ecs.RootSystem {
    constructor() {
        super();

        this.add(new EcsServerRoomSystem());
        this.add(new EcsRoomSystem());
        this.add(new EcsPlayerSystem());
    }
}
