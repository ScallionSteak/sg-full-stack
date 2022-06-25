/*
 * @Author: dgflash
 * @Date: 2022-02-12 11:02:21
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:46:16
 */
import { ecs } from "../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MapLoadComp, MapLoadSystem } from "./bll/MapLoad";
import { MapUnloadComp, MapUnloadSystem } from "./bll/MapUnload";
import { MapModelComp } from "./model/MapModelComp";
import { MapViewComp } from "./view/MapViewComp";

/** 游戏地图 */
export class Scene extends ecs.Entity {
    // 数据层
    MapModel!: MapModelComp;

    // 业务层
    MapLoad!: MapLoadComp;
    MapUnload!: MapUnloadComp;

    // 视图层
    MapView!: MapViewComp;

    protected init(): void {
        this.addComponents<ecs.Comp>(
            MapModelComp);
    }

    /**
     * 地图资源加载
     * @param res       地图资源名
     * @param callback  加载完成回调
     */
    load(res: string, callback: Function) {
        this.MapModel.res = res;
        this.add(MapLoadComp).callback = callback;
    }

    /** 卸载地图 */
    unload() {
        this.add(MapUnloadComp);
    }
}

export class EcsSceneSystem extends ecs.System {
    constructor() {
        super();

        this.add(new MapLoadSystem());
        this.add(new MapUnloadSystem());
    }
}
