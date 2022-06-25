/*
 * @Author: dgflash
 * @Date: 2022-02-11 19:32:06
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:46:03
 */

import { TiledMap, _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../common/ecs/view/CCComp";

const { ccclass, property } = _decorator;

/** 地图 */
@ccclass("MapViewComp")
@ecs.register('MapView', false)
export class MapViewComp extends CCComp {
    /** 地图编号 */
    @property({ type: TiledMap })
    tiledmap: TiledMap = null!;

    reset(): void {
        this.node.destroy();
    }
}