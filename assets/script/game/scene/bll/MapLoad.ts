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
    "SeeDAORoom": "seeDaoMap",
    "HYDAORoom": "HYDAOSpace",
    "AMDAORoom": "AMDAOSpace"
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
                mm.SheJiGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("SheJiGongHui_NPC_Trigger")!;
                mm.ZhiLiGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("ZhiLiGongHui_NPC_Trigger")!;
                mm.TouYanGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("TouYanGongHui_NPC_Trigger")!;
                mm.KaiFaZheGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("KaiFaZheGongHui_NPC_Trigger")!;
                mm.YiShuGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("YiShuGongHui_NPC_Trigger")!;
                mm.JianZhuGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("JianZhuGongHui_NPC_Trigger")!;
                mm.XuanChuanGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("XuanChuanGongHui_NPC_Trigger")!;
                mm.ChanPinGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("ChanPinGongHui_NPC_Trigger")!;
                mm.FanYiGongHui_NPC_Trigger = e.MapView.tiledmap.getLayer("FanYiGongHui_NPC_Trigger")!;
                mm.NFT_Club_NPC_Trigger = e.MapView.tiledmap.getLayer("NFT_Club_NPC_Trigger")!;
                mm.SheJiGongHui_onboarding_a = e.MapView.tiledmap.getLayer("SheJiGongHui_onboarding_a")!;
                mm.SheJiGongHui_onboarding_b = e.MapView.tiledmap.getLayer("SheJiGongHui_onboarding_b")!;
                mm.SheJiGongHui_onboarding_c = e.MapView.tiledmap.getLayer("SheJiGongHui_onboarding_c")!;
                mm.TouYanGongHui_onboarding_a = e.MapView.tiledmap.getLayer("TouYanGongHui_onboarding_a")!;
                mm.TouYanGongHui_onboarding_b = e.MapView.tiledmap.getLayer("TouYanGongHui_onboarding_b")!;
                mm.TouYanGongHui_onboarding_c = e.MapView.tiledmap.getLayer("TouYanGongHui_onboarding_c")!;
                mm.KaiFaGongHui_onboarding_a = e.MapView.tiledmap.getLayer("KaiFaGongHui_onboarding_a")!;
                mm.KaiFaGongHui_onboarding_b = e.MapView.tiledmap.getLayer("KaiFaGongHui_onboarding_b")!;
                mm.KaiFaGongHui_onboarding_c = e.MapView.tiledmap.getLayer("KaiFaGongHui_onboarding_c")!;
                mm.YiShuGongHui_onboarding_a = e.MapView.tiledmap.getLayer("YiShuGongHui_onboarding_a")!;
                mm.YiShuGongHui_onboarding_b = e.MapView.tiledmap.getLayer("YiShuGongHui_onboarding_b")!;
                mm.XuanChuanGongHui_onboarding_a = e.MapView.tiledmap.getLayer("XuanChuanGongHui_onboarding_a")!;
                mm.XuanChuanGongHui_onboarding_b = e.MapView.tiledmap.getLayer("XuanChuanGongHui_onboarding_b")!;
                mm.XuanChuanGongHui_onboarding_c = e.MapView.tiledmap.getLayer("XuanChuanGongHui_onboarding_c")!;
                mm.ChanPinGongHui_onboarding_a = e.MapView.tiledmap.getLayer("ChanPinGongHui_onboarding_a")!;
                mm.ChanPinGongHui_onboarding_b = e.MapView.tiledmap.getLayer("ChanPinGongHui_onboarding_b")!;
                mm.ChanPinGongHui_onboarding_c = e.MapView.tiledmap.getLayer("ChanPinGongHui_onboarding_c")!;
                mm.FanYiGongHui_onboarding_a = e.MapView.tiledmap.getLayer("FanYiGongHui_onboarding_a")!;
                mm.FanYiGongHui_onboarding_b = e.MapView.tiledmap.getLayer("FanYiGongHui_onboarding_b")!;
                mm.FanYiGongHui_onboarding_c = e.MapView.tiledmap.getLayer("FanYiGongHui_onboarding_c")!;
                mm.seedaoBookshelf_a = e.MapView.tiledmap.getLayer("seedaoBookshelf_a")!;
                mm.seedaoBookshelf_b = e.MapView.tiledmap.getLayer("seedaoBookshelf_b")!;
                mm.seedaoBookshelf_c = e.MapView.tiledmap.getLayer("seedaoBookshelf_c")!;
                mm.seedaoBookshelf_d = e.MapView.tiledmap.getLayer("seedaoBookshelf_d")!;
                mm.seedaoBookshelf_e = e.MapView.tiledmap.getLayer("seedaoBookshelf_e")!;
                mm.seedaoBookshelf_f = e.MapView.tiledmap.getLayer("seedaoBookshelf_f")!;
                mm.XiangMuKanBan = e.MapView.tiledmap.getLayer("XiangMuKanBan")!;
                mm.TiAnBan = e.MapView.tiledmap.getLayer("TiAnBan")!;
                mm.FengYunBang = e.MapView.tiledmap.getLayer("FengYunBang")!;
                mm.ShangJinRenWu = e.MapView.tiledmap.getLayer("ShangJinRenWu")!;
                mm.HuoDongRiLi = e.MapView.tiledmap.getLayer("HuoDongRiLi")!;
                mm.gameRoom_White = e.MapView.tiledmap.getLayer("gameRoom_White")!;
                mm.gameRoom_Red = e.MapView.tiledmap.getLayer("gameRoom_Red")!;
                mm.gameRoom_Blue = e.MapView.tiledmap.getLayer("gameRoom_Blue")!;
                mm.gameRoom_Yellow = e.MapView.tiledmap.getLayer("gameRoom_Yellow")!;
                mm.cinema = e.MapView.tiledmap.getLayer("cinema")!;
                mm.musicMicrophone = e.MapView.tiledmap.getLayer("musicMicrophone")!;
                mm.musicGuitar = e.MapView.tiledmap.getLayer("musicGuitar")!;
                mm.musicDrum = e.MapView.tiledmap.getLayer("musicDrum")!;
                mm.musicPaino = e.MapView.tiledmap.getLayer("musicPaino")!;
                mm.HuoDongKanBan = e.MapView.tiledmap.getLayer("HuoDongKanBan")!;
                mm.seedaoWhiteBoard = e.MapView.tiledmap.getLayer("WhiteBoard")!;
                mm.FanYiGongHui_bountyBoard = e.MapView.tiledmap.getLayer("FanYiGongHui_bountyBoard")!;
                mm.ChanPinGongHui_bountyBoard = e.MapView.tiledmap.getLayer("ChanPinGongHui_bountyBoard")!;
                mm.XuanChuanGongHui_bountyBoard = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bountyBoard")!;
                mm.YiShuGongHui_bountyBoard = e.MapView.tiledmap.getLayer("YiShuGongHui_bountyBoard")!;
                mm.KaiFaGongHui_bountyBoard = e.MapView.tiledmap.getLayer("KaiFaGongHui_bountyBoard")!;
                mm.TouYanGongHui_bountyBoard = e.MapView.tiledmap.getLayer("TouYanGongHui_bountyBoard")!;
                mm.ZhiLiGongHui_bountyBoard = e.MapView.tiledmap.getLayer("ZhiLiGongHui_bountyBoard")!;
                mm.SheJiGongHui_bountyBoard = e.MapView.tiledmap.getLayer("SheJiGongHui_bountyBoard")!;
                mm.FanYiGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_a")!;
                mm.FanYiGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_b")!;
                mm.FanYiGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_c")!;
                mm.FanYiGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_d")!;
                mm.FanYiGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_e")!;
                mm.FanYiGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("FanYiGongHui_bookshelf_f")!;
                mm.ChanPinGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_a")!;
                mm.ChanPinGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_b")!;
                mm.ChanPinGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_c")!;
                mm.ChanPinGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_d")!;
                mm.ChanPinGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_e")!;
                mm.ChanPinGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("ChanPinGongHui_bookshelf_f")!;
                mm.XuanChuanGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_a")!;
                mm.XuanChuanGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_b")!;
                mm.XuanChuanGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_c")!;
                mm.XuanChuanGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_d")!;
                mm.XuanChuanGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_e")!;
                mm.XuanChuanGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("XuanChuanGongHui_bookshelf_f")!;
                mm.YiShuGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_a")!;
                mm.YiShuGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_b")!;
                mm.YiShuGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_c")!;
                mm.YiShuGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_d")!;
                mm.YiShuGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_e")!;
                mm.YiShuGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("YiShuGongHui_bookshelf_f")!;
                mm.KaiFaGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_a")!;
                mm.KaiFaGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_b")!;
                mm.KaiFaGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_c")!;
                mm.KaiFaGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_d")!;
                mm.KaiFaGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_e")!;
                mm.KaiFaGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("KaiFaGongHui_bookshelf_f")!;
                mm.TouYanGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_a")!;
                mm.TouYanGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_b")!;
                mm.TouYanGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_c")!;
                mm.TouYanGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_d")!;
                mm.TouYanGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_e")!;
                mm.TouYanGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("TouYanGongHui_bookshelf_f")!;
                mm.SheJiGongHui_bookshelf_a = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_a")!;
                mm.SheJiGongHui_bookshelf_b = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_b")!;
                mm.SheJiGongHui_bookshelf_c = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_c")!;
                mm.SheJiGongHui_bookshelf_d = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_d")!;
                mm.SheJiGongHui_bookshelf_e = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_e")!;
                mm.SheJiGongHui_bookshelf_f = e.MapView.tiledmap.getLayer("SheJiGongHui_bookshelf_f")!;
                break;
            case 'HYDAOSpace':
                mm.ChanPinLanMu = e.MapView.tiledmap.getLayer("ChanPinLanMu")!;
                mm.BoKeLanMu = e.MapView.tiledmap.getLayer("BoKeLanMu")!;
                mm.GongXianBang = e.MapView.tiledmap.getLayer("GongXianBang")!;
                mm.DAOShiJianBiao = e.MapView.tiledmap.getLayer("DAOShiJianBiao")!;
                mm.ZhiBoZu = e.MapView.tiledmap.getLayer("ZhiBoZu")!;
                mm.BianJiZu = e.MapView.tiledmap.getLayer("BianJiZu")!;
                mm.XuanChuanZu = e.MapView.tiledmap.getLayer("XuanChuanZu")!;
                mm.YunYingZu = e.MapView.tiledmap.getLayer("YunYingZu")!;
                mm.ZhiLiZu = e.MapView.tiledmap.getLayer("ZhiLiZu")!;
                mm.ZiLiaoGuan = e.MapView.tiledmap.getLayer("ZiLiaoGuan")!;
                mm.CaiWuShi = e.MapView.tiledmap.getLayer("CaiWuShi")!;
                mm.GongJuJi = e.MapView.tiledmap.getLayer("GongJuJi")!;
                break;
            case 'AMDAOSpace':
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
                        let SheJiGongHui_NPC_Trigger_gid = mm.SheJiGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let ZhiLiGongHui_NPC_Trigger_gid = mm.ZhiLiGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let TouYanGongHui_NPC_Trigger_gid = mm.TouYanGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let KaiFaZheGongHui_NPC_Trigger_gid = mm.KaiFaZheGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let YiShuGongHui_NPC_Trigger_gid = mm.YiShuGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let JianZhuGongHui_NPC_Trigger_gid = mm.JianZhuGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let XuanChuanGongHui_NPC_Trigger_gid = mm.XuanChuanGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let ChanPinGongHui_NPC_Trigger_gid = mm.ChanPinGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let FanYiGongHui_NPC_Trigger_gid = mm.FanYiGongHui_NPC_Trigger.getTileGIDAt(x, y);
                        let NFT_Club_NPC_Trigger_gid = mm.NFT_Club_NPC_Trigger.getTileGIDAt(x, y);
                        let SheJiGongHui_onboarding_a_gid = mm.SheJiGongHui_onboarding_a.getTileGIDAt(x, y);
                        let SheJiGongHui_onboarding_b_gid = mm.SheJiGongHui_onboarding_b.getTileGIDAt(x, y);
                        let SheJiGongHui_onboarding_c_gid = mm.SheJiGongHui_onboarding_c.getTileGIDAt(x, y);
                        let TouYanGongHui_onboarding_a_gid = mm.TouYanGongHui_onboarding_a.getTileGIDAt(x, y);
                        let TouYanGongHui_onboarding_b_gid = mm.TouYanGongHui_onboarding_b.getTileGIDAt(x, y);
                        let TouYanGongHui_onboarding_c_gid = mm.TouYanGongHui_onboarding_c.getTileGIDAt(x, y);
                        let KaiFaGongHui_onboarding_a_gid = mm.KaiFaGongHui_onboarding_a.getTileGIDAt(x, y);
                        let KaiFaGongHui_onboarding_b_gid = mm.KaiFaGongHui_onboarding_b.getTileGIDAt(x, y);
                        let KaiFaGongHui_onboarding_c_gid = mm.KaiFaGongHui_onboarding_c.getTileGIDAt(x, y);
                        let YiShuGongHui_onboarding_a_gid = mm.YiShuGongHui_onboarding_a.getTileGIDAt(x, y);
                        let YiShuGongHui_onboarding_b_gid = mm.YiShuGongHui_onboarding_b.getTileGIDAt(x, y);
                        let XuanChuanGongHui_onboarding_a_gid = mm.XuanChuanGongHui_onboarding_a.getTileGIDAt(x, y);
                        let XuanChuanGongHui_onboarding_b_gid = mm.XuanChuanGongHui_onboarding_b.getTileGIDAt(x, y);
                        let XuanChuanGongHui_onboarding_c_gid = mm.XuanChuanGongHui_onboarding_c.getTileGIDAt(x, y);
                        let ChanPinGongHui_onboarding_a_gid = mm.ChanPinGongHui_onboarding_a.getTileGIDAt(x, y);
                        let ChanPinGongHui_onboarding_b_gid = mm.ChanPinGongHui_onboarding_b.getTileGIDAt(x, y);
                        let ChanPinGongHui_onboarding_c_gid = mm.ChanPinGongHui_onboarding_c.getTileGIDAt(x, y);
                        let FanYiGongHui_onboarding_a_gid = mm.FanYiGongHui_onboarding_a.getTileGIDAt(x, y);
                        let FanYiGongHui_onboarding_b_gid = mm.FanYiGongHui_onboarding_b.getTileGIDAt(x, y);
                        let FanYiGongHui_onboarding_c_gid = mm.FanYiGongHui_onboarding_c.getTileGIDAt(x, y);
                        let seedaoBookshelf_a_gid = mm.seedaoBookshelf_a.getTileGIDAt(x, y);
                        let seedaoBookshelf_b_gid = mm.seedaoBookshelf_b.getTileGIDAt(x, y);
                        let seedaoBookshelf_c_gid = mm.seedaoBookshelf_c.getTileGIDAt(x, y);
                        let seedaoBookshelf_d_gid = mm.seedaoBookshelf_d.getTileGIDAt(x, y);
                        let seedaoBookshelf_e_gid = mm.seedaoBookshelf_e.getTileGIDAt(x, y);
                        let seedaoBookshelf_f_gid = mm.seedaoBookshelf_f.getTileGIDAt(x, y);
                        let XiangMuKanBan_gid = mm.XiangMuKanBan.getTileGIDAt(x, y);
                        let TiAnBan_gid = mm.TiAnBan.getTileGIDAt(x, y);
                        let FengYunBang_gid = mm.FengYunBang.getTileGIDAt(x, y);
                        let ShangJinRenWu_gid = mm.ShangJinRenWu.getTileGIDAt(x, y);
                        let HuoDongRiLi_gid = mm.HuoDongRiLi.getTileGIDAt(x, y);
                        let gameRoom_White_gid = mm.gameRoom_White.getTileGIDAt(x, y);
                        let gameRoom_Red_gid = mm.gameRoom_Red.getTileGIDAt(x, y);
                        let gameRoom_Blue_gid = mm.gameRoom_Blue.getTileGIDAt(x, y);
                        let gameRoom_Yellow_gid = mm.gameRoom_Yellow.getTileGIDAt(x, y);
                        let cinema_gid = mm.cinema.getTileGIDAt(x, y);
                        let musicMicrophone_gid = mm.musicMicrophone.getTileGIDAt(x, y);
                        let musicGuitar_gid = mm.musicGuitar.getTileGIDAt(x, y);
                        let musicDrum_gid = mm.musicDrum.getTileGIDAt(x, y);
                        let musicPaino_gid = mm.musicPaino.getTileGIDAt(x, y);
                        let HuoDongKanBan_gid = mm.HuoDongKanBan.getTileGIDAt(x, y);
                        let seedaoWhiteBoard_gid = mm.seedaoWhiteBoard.getTileGIDAt(x, y);
                        let FanYiGongHui_bountyBoard_gid = mm.FanYiGongHui_bountyBoard.getTileGIDAt(x, y);
                        let ChanPinGongHui_bountyBoard_gid = mm.ChanPinGongHui_bountyBoard.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bountyBoard_gid = mm.XuanChuanGongHui_bountyBoard.getTileGIDAt(x, y);
                        let YiShuGongHui_bountyBoard_gid = mm.YiShuGongHui_bountyBoard.getTileGIDAt(x, y);
                        let KaiFaGongHui_bountyBoard_gid = mm.KaiFaGongHui_bountyBoard.getTileGIDAt(x, y);
                        let TouYanGongHui_bountyBoard_gid = mm.TouYanGongHui_bountyBoard.getTileGIDAt(x, y);
                        let ZhiLiGongHui_bountyBoard_gid = mm.ZhiLiGongHui_bountyBoard.getTileGIDAt(x, y);
                        let SheJiGongHui_bountyBoard_gid = mm.SheJiGongHui_bountyBoard.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_a_gid = mm.FanYiGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_b_gid = mm.FanYiGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_c_gid = mm.FanYiGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_d_gid = mm.FanYiGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_e_gid = mm.FanYiGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let FanYiGongHui_bookshelf_f_gid = mm.FanYiGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_a_gid = mm.ChanPinGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_b_gid = mm.ChanPinGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_c_gid = mm.ChanPinGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_d_gid = mm.ChanPinGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_e_gid = mm.ChanPinGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let ChanPinGongHui_bookshelf_f_gid = mm.ChanPinGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_a_gid = mm.XuanChuanGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_b_gid = mm.XuanChuanGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_c_gid = mm.XuanChuanGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_d_gid = mm.XuanChuanGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_e_gid = mm.XuanChuanGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let XuanChuanGongHui_bookshelf_f_gid = mm.XuanChuanGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_a_gid = mm.YiShuGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_b_gid = mm.YiShuGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_c_gid = mm.YiShuGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_d_gid = mm.YiShuGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_e_gid = mm.YiShuGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let YiShuGongHui_bookshelf_f_gid = mm.YiShuGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_a_gid = mm.KaiFaGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_b_gid = mm.KaiFaGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_c_gid = mm.KaiFaGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_d_gid = mm.KaiFaGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_e_gid = mm.KaiFaGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let KaiFaGongHui_bookshelf_f_gid = mm.KaiFaGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_a_gid = mm.TouYanGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_b_gid = mm.TouYanGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_c_gid = mm.TouYanGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_d_gid = mm.TouYanGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_e_gid = mm.TouYanGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let TouYanGongHui_bookshelf_f_gid = mm.TouYanGongHui_bookshelf_f.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_a_gid = mm.SheJiGongHui_bookshelf_a.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_b_gid = mm.SheJiGongHui_bookshelf_b.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_c_gid = mm.SheJiGongHui_bookshelf_c.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_d_gid = mm.SheJiGongHui_bookshelf_d.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_e_gid = mm.SheJiGongHui_bookshelf_e.getTileGIDAt(x, y);
                        let SheJiGongHui_bookshelf_f_gid = mm.SheJiGongHui_bookshelf_f.getTileGIDAt(x, y);

                        buildingGidArr.push(
                            SheJiGongHui_NPC_Trigger_gid,
                            TouYanGongHui_NPC_Trigger_gid,
                            KaiFaZheGongHui_NPC_Trigger_gid,
                            YiShuGongHui_NPC_Trigger_gid,
                            XuanChuanGongHui_NPC_Trigger_gid,
                            ChanPinGongHui_NPC_Trigger_gid,
                            FanYiGongHui_NPC_Trigger_gid,
                            ZhiLiGongHui_NPC_Trigger_gid,
                            JianZhuGongHui_NPC_Trigger_gid,
                            NFT_Club_NPC_Trigger_gid,
                            SheJiGongHui_onboarding_a_gid,
                            SheJiGongHui_onboarding_b_gid,
                            SheJiGongHui_onboarding_c_gid,
                            TouYanGongHui_onboarding_a_gid,
                            TouYanGongHui_onboarding_b_gid,
                            TouYanGongHui_onboarding_c_gid,
                            KaiFaGongHui_onboarding_a_gid,
                            KaiFaGongHui_onboarding_b_gid,
                            KaiFaGongHui_onboarding_c_gid,
                            YiShuGongHui_onboarding_a_gid,
                            YiShuGongHui_onboarding_b_gid,
                            XuanChuanGongHui_onboarding_a_gid,
                            XuanChuanGongHui_onboarding_b_gid,
                            XuanChuanGongHui_onboarding_c_gid,
                            ChanPinGongHui_onboarding_a_gid,
                            ChanPinGongHui_onboarding_b_gid,
                            ChanPinGongHui_onboarding_c_gid,
                            FanYiGongHui_onboarding_a_gid,
                            FanYiGongHui_onboarding_b_gid,
                            FanYiGongHui_onboarding_c_gid,
                            seedaoBookshelf_a_gid,
                            seedaoBookshelf_b_gid,
                            seedaoBookshelf_c_gid,
                            seedaoBookshelf_d_gid,
                            seedaoBookshelf_e_gid,
                            seedaoBookshelf_f_gid,
                            XiangMuKanBan_gid,
                            TiAnBan_gid,
                            FengYunBang_gid,
                            ShangJinRenWu_gid,
                            HuoDongRiLi_gid,
                            gameRoom_White_gid,
                            gameRoom_Red_gid,
                            gameRoom_Blue_gid,
                            gameRoom_Yellow_gid,
                            cinema_gid,
                            musicMicrophone_gid,
                            musicGuitar_gid,
                            musicDrum_gid,
                            musicPaino_gid,
                            HuoDongKanBan_gid,
                            seedaoWhiteBoard_gid,
                            FanYiGongHui_bountyBoard_gid,
                            ChanPinGongHui_bountyBoard_gid,
                            XuanChuanGongHui_bountyBoard_gid,
                            YiShuGongHui_bountyBoard_gid,
                            KaiFaGongHui_bountyBoard_gid,
                            TouYanGongHui_bountyBoard_gid,
                            ZhiLiGongHui_bountyBoard_gid,
                            SheJiGongHui_bountyBoard_gid,
                            FanYiGongHui_bookshelf_a_gid,
                            FanYiGongHui_bookshelf_b_gid,
                            FanYiGongHui_bookshelf_c_gid,
                            FanYiGongHui_bookshelf_d_gid,
                            FanYiGongHui_bookshelf_e_gid,
                            FanYiGongHui_bookshelf_f_gid,
                            ChanPinGongHui_bookshelf_a_gid,
                            ChanPinGongHui_bookshelf_b_gid,
                            ChanPinGongHui_bookshelf_c_gid,
                            ChanPinGongHui_bookshelf_d_gid,
                            ChanPinGongHui_bookshelf_e_gid,
                            ChanPinGongHui_bookshelf_f_gid,
                            XuanChuanGongHui_bookshelf_a_gid,
                            XuanChuanGongHui_bookshelf_b_gid,
                            XuanChuanGongHui_bookshelf_c_gid,
                            XuanChuanGongHui_bookshelf_d_gid,
                            XuanChuanGongHui_bookshelf_e_gid,
                            XuanChuanGongHui_bookshelf_f_gid,
                            YiShuGongHui_bookshelf_a_gid,
                            YiShuGongHui_bookshelf_b_gid,
                            YiShuGongHui_bookshelf_c_gid,
                            YiShuGongHui_bookshelf_d_gid,
                            YiShuGongHui_bookshelf_e_gid,
                            YiShuGongHui_bookshelf_f_gid,
                            KaiFaGongHui_bookshelf_a_gid,
                            KaiFaGongHui_bookshelf_b_gid,
                            KaiFaGongHui_bookshelf_c_gid,
                            KaiFaGongHui_bookshelf_d_gid,
                            KaiFaGongHui_bookshelf_e_gid,
                            KaiFaGongHui_bookshelf_f_gid,
                            TouYanGongHui_bookshelf_a_gid,
                            TouYanGongHui_bookshelf_b_gid,
                            TouYanGongHui_bookshelf_c_gid,
                            TouYanGongHui_bookshelf_d_gid,
                            TouYanGongHui_bookshelf_e_gid,
                            TouYanGongHui_bookshelf_f_gid,
                            SheJiGongHui_bookshelf_a_gid,
                            SheJiGongHui_bookshelf_b_gid,
                            SheJiGongHui_bookshelf_c_gid,
                            SheJiGongHui_bookshelf_d_gid,
                            SheJiGongHui_bookshelf_e_gid,
                            SheJiGongHui_bookshelf_f_gid
                        );
                        break;
                    case 'HYDAOSpace':
                        let ChanPinLanMu_gid = mm.ChanPinLanMu.getTileGIDAt(x, y);
                        let BoKeLanMu_gid = mm.BoKeLanMu.getTileGIDAt(x, y);
                        let GongXianBang_gid = mm.GongXianBang.getTileGIDAt(x, y);
                        let DAOShiJianBiao_gid = mm.DAOShiJianBiao.getTileGIDAt(x, y);
                        let ZhiBoZu_gid = mm.ZhiBoZu.getTileGIDAt(x, y);
                        let BianJiZu_gid = mm.BianJiZu.getTileGIDAt(x, y);
                        let XuanChuanZu_gid = mm.XuanChuanZu.getTileGIDAt(x, y);
                        let YunYingZu_gid = mm.YunYingZu.getTileGIDAt(x, y);
                        let ZhiLiZu_gid = mm.ZhiLiZu.getTileGIDAt(x, y);
                        let ZiLiaoGuan_gid = mm.ZiLiaoGuan.getTileGIDAt(x, y);
                        let CaiWuShi_gid = mm.CaiWuShi.getTileGIDAt(x, y);
                        let GongJuJi_gid = mm.GongJuJi.getTileGIDAt(x, y);

                        buildingGidArr.push(
                            ChanPinLanMu_gid,
                            BoKeLanMu_gid,
                            GongXianBang_gid,
                            DAOShiJianBiao_gid,
                            ZhiBoZu_gid,
                            BianJiZu_gid,
                            XuanChuanZu_gid,
                            YunYingZu_gid,
                            ZhiLiZu_gid,
                            ZiLiaoGuan_gid,
                            CaiWuShi_gid,
                            GongJuJi_gid
                        );
                        break;
                    case 'AMDAOSpace':


                        buildingGidArr.push(

                        );
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