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
    "自定义房间": "A-Public Space",
    "系统房间": "PublicSpace----"
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

        let tiledSize = mm.tiledmap.getTileSize();
        mm.floor = e.MapView.tiledmap.getLayer("Background")!;
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

        /** 感觉是坐标系不对的问题，但效率也低，先不调试了 */
        // let collisionLayerSize = mm.barrier.getLayerSize();
        // for(let i = 0; i < collisionLayerSize.width; i++) {
        //     for(let j = 0; j < collisionLayerSize.height; j++) {
        //         let tiled = mm.barrier.getTiledTileAt(i, j, true);
        //         if (tiled.grid != 0) {
        //             let body = tiled.node.addComponent(RigidBody);
        //             body.type = RigidBody.Type.STATIC;
        //             let collider = tiled.node.addComponent(BoxCollider);
        //             collider.center.x = tiledSize.width / 2;
        //             collider.center.y = tiledSize.height / 2;
        //             collider.size = v3(tiledSize.width, tiledSize.height, 1);                    
        //         }
        //     }
        // }

        /** 以下是一种判断碰撞的方式，先注掉用自己熟悉的，有问题再比较 */
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

                mm.tiles[x].push(tile);
            }
        }
        console.log(mm.tiles[200][155]);
    }
}