/*
 * @Author: dgflash
 * @Date: 2022-03-21 11:12:03
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:45:58
 */
import { EventTouch, log, TiledLayer, TiledMap, TiledObjectGroup, Vec3 } from "cc";
import { ViewUtil } from "../../../../../extensions/oops-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { SingletonModuleComp } from "../../common/ecs/SingletonModuleComp";
import { Role } from "../../role/Role";

/** 地图数据 */
@ecs.register('MapModel')
export class MapModelComp extends ecs.Comp {
    /** 地图名 */
    name: string = "";

    /** 资源名 */
    res: string = "map";

    /** 资源路径 */
    get path(): string {
        return `game/content/scene/${this.res}`;
    }

    /** 地图编号 */
    id: number = -1;
    /** X 轴网格数量 */
    tiledXCount: number = 0;
    /** Y 轴网格数量 */
    tiledYCount: number = 0;
    /** 单个格子宽度 */
    tiledWidth: number = 0;
    /** 单个格子高度 */
    tiledHeight: number = 0;
    /** 单个格子一半宽度 */
    tiledWidthHalf: number = 0;
    /** 单个格子一半高度 */
    tiledHeightHalf: number = 0;
    /** 地形宽度 */
    width: number = 0;
    /** 地形高度 */
    height: number = 0;
    /** 地形一半宽度 */
    widthHalf: number = 0;
    /** 地形一半高度 */
    heightHalf: number = 0;

    /** 地形对象 */
    tiledmap: TiledMap = null!;
    /** 地形层 */
    floor: TiledLayer = null!;
    /** 障碍层 */
    barrier: TiledLayer = null!;
    /** 游戏层 */
    game: TiledObjectGroup = null!;
    /** 各建筑物 */
    bountyBuilding: TiledLayer = null;
    gardenBuilding: TiledLayer = null;
    projectsParkBuilding: TiledLayer = null;

    /** 所有游戏网格数据 */
    tiles: Array<Array<Tile>> = [];

    reset(): void {
        this.res = "";
    }

    /** 获取网格 */
    getTile(x: number, y: number) {
        try {
            let t = this.tiles[x][y];
            return t;
        }
        catch {
            log("策划检测位置是否存在", x, y);//上传报错平台
            return;
        }
    }

    /** 通过屏幕触摸坐标获取网格 */
    getTargetTile(event: EventTouch): Tile {
        let mapPos = ViewUtil.calculateScreenPosToSpacePos(event, this.tiledmap.node);
        return this.getPosToTile(mapPos);
    }

    /** 通过地图像素坐标转网格坐标 */
    getPosToTile(mapPos: Vec3): Tile {
        mapPos.x += this.widthHalf;
        mapPos.y += this.heightHalf;
        let x = Math.floor(mapPos.x / this.tiledWidth);
        let y = Math.floor((this.height - mapPos.y) / this.tiledHeight);
        try {
            let t = this.tiles[x][y];
            return t;
        }
        catch {
            return null;
        }
    }
}

/** 游戏网格数据 */
export class Tile {
    /** 网格 X 轴坐标 */
    tx: number = 0;
    /** 网格 Y 轴坐标 */
    ty: number = 0;
    /** 地图像素 X 轴坐标（Cocos坐标系） */
    px: number = 0;
    /** 地图像素 Y 轴坐标（Cocos坐标系） */
    py: number = 0;
    /** 地图像角色 Y 轴坐标（Cocos坐标系） */
    py_role: number = 0;
    /** 是否为障碍物 */
    barrier: boolean = false;
    /** 建筑物ID */
    buildingID: number = 0;
    /** 角色 */
    role: Role = null;

    addRole(role: Role) {
        this.barrier = true;
        this.role = role;
        this.role.RoleModel.tile = this;
    }

    removeRole() {
        this.barrier = false;
        this.role.RoleModel.tile = null;
        this.role = null;
    }

    reset() {
        this.tx = 0;
        this.ty = 0;
        this.px = 0;
        this.py = 0;
        this.py_role = 0;
        this.role = null;
    }
}