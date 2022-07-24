/*
 * @Author: dgflash
 * @Date: 2022-02-12 11:02:21
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:45:43
 */
import { BoxCollider, Director, director, EPhysics2DDrawFlags, find, macro, Node, PhysicsSystem, PhysicsSystem2D, PhysicsSystem2D_base, RigidBody, TiledMap, TiledMapAsset, UITransform, v3, Vec3 } from "cc";
import { resLoader } from "../../../../../extensions/oops-framework/assets/core/common/loader/ResLoader";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ViewUtil } from "../../../../../extensions/oops-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Tile } from "../model/MapModelComp";
import { Scene } from "../Scene";
import { MapViewComp } from "../view/MapViewComp";
import { MapViewControl } from "../view/MapViewControl";

/** 后续修改点:演示只有两张地图，到时候通过key来映射tilemap的资源名 */
var data: any = {
    "PublicSpaceRoom": "A-Public Space",
    "SeeDAORoom": "seeDaoMap"
}

/** 加载地形资源（放在其它模块加载，有进度条） */
@ecs.register('MapLoad')
export class MapLoadComp extends ecs.Comp {
    callback: Function;

    reset() { }
}

export class MapLoadSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    onLoad() {
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(MapLoadComp);
    }

    entityEnter(e: Scene): void {
        ViewUtil.loadPrefabNode(e.MapModel.path, (node: Node) => {
            var url = `game/content/scene/publicSpace/${data[e.MapModel.name]}`;
            resLoader.load(url, TiledMapAsset, (err: Error | null, tmx: TiledMapAsset) => {
                if (err) {
                    console.error(`地图名为【${url}】的地图加载失败`);
                    return;
                }

                // 显示地图
                node.parent = oops.gui.game;

                // 显示TMX地图
                find("map/tilemap", node).getComponent(TiledMap)!.tmxAsset = tmx;

                // 地图加到ECS实体中
                let mv = node.getComponent(MapViewComp);
                e.add(mv);

                let mvc = node.getComponent(MapViewControl);
                mvc.init();

                this.setMapModel(e);

                setTimeout(() => {
                    e.MapLoad.callback && e.MapLoad.callback();
                    e.remove(MapLoadComp);

                    // 后续修改点：添加背景音乐
                    
                }, 100);

            });
        });
    }

    /** 设置地图基础数据 */
    private setMapModel(e: Scene) {
        var mm = e.MapModel;
        mm.tiledmap = e.MapView.tiledmap;

        /**
         * 根据不同的tmx文件名称取不同的layer
         * 美术在tmx文件中，用建筑名称建layer，每个建筑一个layer，位置和collsion要完全一致
         * 程序取到layer后，根据事先确定好的顺序定buildingID，用buildingID控制弹哪个窗口出来
         * 每个DAO照理说拥有的building应该都一样，所以也可以考虑不用读tmx文件名，保证大家都有一样的层，也行，最多有的层是空的
         * npc也用layer做，npc就一定要分不同地图了，做一个npcID，然后预设不同ID弹对应的窗口
         */
        switch (mm.tiledmap.getComponent(TiledMap)._tmxFile.name) {
            case 'A-Public Space':
                //不共用的layer这里读
                break;
            case 'seeDaoMap':
                break;
            default:
                break;
        }
        //共有的要读的layer放这里
        mm.bountyBuilding = e.MapView.tiledmap.getLayer("bountyBuilding")!;
        mm.gardenBuilding = e.MapView.tiledmap.getLayer("gardenBuilding")!;
        mm.meetingBuilding = e.MapView.tiledmap.getLayer("meetingBuilding")!;
        mm.personalCenterBuilding = e.MapView.tiledmap.getLayer("personalCenterBuilding")!;
        mm.projectsParkBuilding = e.MapView.tiledmap.getLayer("projectsParkBuilding")!;
        mm.floor = e.MapView.tiledmap.getLayer("background")!;
        mm.barrier = e.MapView.tiledmap.getLayer("collision")!;
        mm.game = e.MapView.tiledmap.getObjectGroup("game")!;
        mm.game.node.active = true; //强制打开，以防不当心别的地方或者调试的时候关掉了

        mm.tiledXCount = e.MapView.tiledmap.getMapSize().width;
        mm.tiledYCount = e.MapView.tiledmap.getMapSize().height;
        mm.tiledWidth = e.MapView.tiledmap.getTileSize().width;
        mm.tiledHeight = e.MapView.tiledmap.getTileSize().height;
        mm.width = e.MapView.tiledmap.getComponent(UITransform)!.width;
        mm.height = e.MapView.tiledmap.getComponent(UITransform)!.height;
        mm.tiledWidthHalf = mm.tiledWidth / 2;
        mm.tiledHeightHalf = mm.tiledHeight / 2;
        mm.widthHalf = mm.width / 2;
        mm.heightHalf = mm.height / 2;

        /** 效率比较高的记录碰撞层的方式 */
        for (let x = 0; x < mm.tiledXCount; x++) {
            if (mm.tiles[x] == null) {
                mm.tiles[x] = new Array<Tile>();
            }

            for (let y = 0; y < mm.tiledYCount; y++) {
                let barrier_pos = mm.floor.getPositionAt(x, y);                        // 网格像素坐标

                let tile = new Tile();
                tile.tx = x;
                tile.ty = y;
                tile.px = barrier_pos.x - mm.widthHalf + mm.tiledWidthHalf;
                tile.py = barrier_pos.y - mm.heightHalf + mm.tiledHeightHalf;
                tile.py_role = barrier_pos.y - mm.heightHalf;

                // 障碍物数据
                let barrier_gid = mm.barrier.getTileGIDAt(x, y);
                tile.barrier = barrier_gid != 0;

                //建筑数据
                let bountyBuilding_gid = mm.bountyBuilding.getTileGIDAt(x,y);
                let gardenBuilding_gid = mm.gardenBuilding.getTileGIDAt(x, y);
                let meetingBuilding_gid = mm.meetingBuilding.getTileGIDAt(x, y);
                let personalCenterBuilding_gid = mm.personalCenterBuilding.getTileGIDAt(x, y);
                let projectsParkBuilding_gid = mm.projectsParkBuilding.getTileGIDAt(x, y);
                let buildingGidArr = [];
                buildingGidArr.push(bountyBuilding_gid, gardenBuilding_gid, meetingBuilding_gid, personalCenterBuilding_gid, projectsParkBuilding_gid);
                tile.buildingID = -1; //设定默认值，代表不是building，除非后面主动赋值了，不然就是没building
                for (let i = 0; i< buildingGidArr.length; i++) {
                    if (buildingGidArr[i] != 0) {
                        tile.buildingID = i;  //所以buildingID的顺序要喝上面push的顺序保持一致
                        break;
                    }
                }
                mm.tiles[x].push(tile);
            }
        }
        console.log(mm.tiles[200][155]);
    }
}