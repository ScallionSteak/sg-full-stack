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
                mm.UI_D2DSquare = e.MapView.tiledmap.getLayer("UI_D2DSquare")!;
                mm.UI_BountyBoard = e.MapView.tiledmap.getLayer("UI_BountyBoard")!;
                mm.UI_SupportCenter = e.MapView.tiledmap.getLayer("UI_SupportCenter")!;
                mm.UI_BigTower = e.MapView.tiledmap.getLayer("UI_BigTower")!;
                mm.UI_DAOEX = e.MapView.tiledmap.getLayer("UI_DAOEX")!;
                mm.UI_EntertainmentArea_4 = e.MapView.tiledmap.getLayer("UI_EntertainmentArea_4")!;
                mm.UI_EntertainmentArea_3 = e.MapView.tiledmap.getLayer("UI_EntertainmentArea_3")!;
                mm.UI_EntertainmentArea_2 = e.MapView.tiledmap.getLayer("UI_EntertainmentArea_2")!;
                mm.UI_EntertainmentArea_1 = e.MapView.tiledmap.getLayer("UI_EntertainmentArea_1")!;
                mm.UI_ProjectsPark_null = e.MapView.tiledmap.getLayer("UI_ProjectsPark_null")!;
                mm.UI_ProjectsPark_SG = e.MapView.tiledmap.getLayer("UI_ProjectsPark_SG")!;
                mm.UI_ProjectsPark_HaiDAO = e.MapView.tiledmap.getLayer("UI_ProjectsPark_HaiDAO")!;
                mm.UI_ProjectsPark_AMDAO = e.MapView.tiledmap.getLayer("UI_ProjectsPark_AMDAO")!;
                mm.UI_ProjectsPark_CC = e.MapView.tiledmap.getLayer("UI_ProjectsPark_CC")!;
                mm.UI_DAOGarden_HaiDAO = e.MapView.tiledmap.getLayer("UI_DAOGarden_HaiDAO")!;
                mm.UI_DAOGarden_SEEDAO = e.MapView.tiledmap.getLayer("UI_DAOGarden_SEEDAO")!;
                mm.UI_DAOGarden_AMDAO = e.MapView.tiledmap.getLayer("UI_DAOGarden_AMDAO")!;
                mm.UI_DAOGarden_null = e.MapView.tiledmap.getLayer("UI_DAOGarden_null")!;
                mm.UI_DAO_null = e.MapView.tiledmap.getLayer("UI_DAO_null")!;
                mm.UI_DAO_AMDAO = e.MapView.tiledmap.getLayer("UI_DAO_AMDAO")!;
                mm.UI_DAO_HaiDAO = e.MapView.tiledmap.getLayer("UI_DAO_HaiDAO")!;
                mm.UI_DAO_SEEDAO = e.MapView.tiledmap.getLayer("UI_DAO_SEEDAO")!;
                break;
            case 'seeDaoMap':
                mm.UI_DAOGarden_null = e.MapView.tiledmap.getLayer("UI_DAOGarden_null")!;
                break;
            default:
                break;
        }
        
        //共有的要读的layer放这里
        // mm.projectsParkBuilding = e.MapView.tiledmap.getLayer("npc")!;
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

                let buildingGidArr = [];
                //分地图处理建筑数据
                switch (mm.tiledmap.getComponent(TiledMap)._tmxFile.name) {
                    case 'A-Public Space':
                        //建筑数据
                        let UI_D2DSquare_gid = mm.UI_D2DSquare.getTileGIDAt(x, y);
                        let UI_BountyBoard_gid = mm.UI_BountyBoard.getTileGIDAt(x, y);
                        let UI_SupportCenter_gid = mm.UI_SupportCenter.getTileGIDAt(x, y);
                        let UI_BigTower_gid = mm.UI_BigTower.getTileGIDAt(x, y);
                        let UI_DAOEX_gid = mm.UI_DAOEX.getTileGIDAt(x, y);
                        let UI_EntertainmentArea_4_gid = mm.UI_EntertainmentArea_4.getTileGIDAt(x, y);
                        let UI_EntertainmentArea_3_gid = mm.UI_EntertainmentArea_3.getTileGIDAt(x, y);
                        let UI_EntertainmentArea_2_gid = mm.UI_EntertainmentArea_2.getTileGIDAt(x, y);
                        let UI_EntertainmentArea_1_gid = mm.UI_EntertainmentArea_1.getTileGIDAt(x, y);
                        let UI_ProjectsPark_null_gid = mm.UI_ProjectsPark_null.getTileGIDAt(x, y);
                        let UI_ProjectsPark_SG_gid = mm.UI_ProjectsPark_SG.getTileGIDAt(x, y);
                        let UI_ProjectsPark_HaiDAO_gid = mm.UI_ProjectsPark_HaiDAO.getTileGIDAt(x, y);
                        let UI_ProjectsPark_AMDAO_gid = mm.UI_ProjectsPark_AMDAO.getTileGIDAt(x, y);
                        let UI_ProjectsPark_CC_gid = mm.UI_ProjectsPark_CC.getTileGIDAt(x, y);
                        let UI_DAOGarden_HaiDAO_gid = mm.UI_DAOGarden_HaiDAO.getTileGIDAt(x, y);
                        let UI_DAOGarden_SEEDAO_gid = mm.UI_DAOGarden_SEEDAO.getTileGIDAt(x, y);
                        let UI_DAOGarden_AMDAO_gid = mm.UI_DAOGarden_AMDAO.getTileGIDAt(x, y);
                        let UI_DAOGarden_null_gid = mm.UI_DAOGarden_null.getTileGIDAt(x, y);
                        let UI_DAO_null_gid = mm.UI_DAO_null.getTileGIDAt(x, y);
                        let UI_DAO_AMDAO_gid = mm.UI_DAO_AMDAO.getTileGIDAt(x, y);
                        let UI_DAO_HaiDAO_gid = mm.UI_DAO_HaiDAO.getTileGIDAt(x, y);
                        let UI_DAO_SEEDAO_gid = mm.UI_DAO_SEEDAO.getTileGIDAt(x, y);

                        buildingGidArr.push(
                            UI_D2DSquare_gid,
                            UI_BountyBoard_gid,
                            UI_SupportCenter_gid,
                            UI_BigTower_gid,
                            UI_DAOEX_gid,
                            UI_EntertainmentArea_4_gid,
                            UI_EntertainmentArea_3_gid,
                            UI_EntertainmentArea_2_gid,
                            UI_EntertainmentArea_1_gid,
                            UI_ProjectsPark_null_gid,
                            UI_ProjectsPark_SG_gid,
                            UI_ProjectsPark_HaiDAO_gid,
                            UI_ProjectsPark_AMDAO_gid,
                            UI_ProjectsPark_CC_gid,
                            UI_DAOGarden_HaiDAO_gid,
                            UI_DAOGarden_SEEDAO_gid,
                            UI_DAOGarden_AMDAO_gid,
                            UI_DAOGarden_null_gid,
                            UI_DAO_null_gid,
                            UI_DAO_AMDAO_gid,
                            UI_DAO_HaiDAO_gid,
                            UI_DAO_SEEDAO_gid
                        );
                        break;
                    case 'seeDaoMap':
                        break;
                    default:
                        break;
                }
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