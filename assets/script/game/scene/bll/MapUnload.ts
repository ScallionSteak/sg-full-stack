/*
 * @Author: dgflash
 * @Date: 2022-05-16 09:20:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:45:51
 */
import { resLoader } from "../../../../../extensions/oops-framework/assets/core/common/loader/ResLoader";
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Scene } from "../Scene";
import { MapViewComp } from "../view/MapViewComp";

/** 地图角色添加 */
@ecs.register('MapUnload')
export class MapUnloadComp extends ecs.Comp {
    callback: Function = null!;

    reset() {
        this.callback = null;
    }
}

export class MapUnloadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MapUnloadComp);
    }

    entityEnter(e: Scene): void {
        // 释放地图显示对象
        e.remove(MapViewComp);

        // 释放地图资源
        resLoader.release(e.MapModel.path);
        resLoader.releaseDir("game");

        e.get(MapUnloadComp).callback();


        Logger.logBusiness("【地图】释放地图资源");

    }
}