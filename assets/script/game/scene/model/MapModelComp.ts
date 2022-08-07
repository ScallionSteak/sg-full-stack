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
    /** 公区需互动layer */
    UI_D2DSquare: TiledLayer = null;
    UI_BountyBoard: TiledLayer = null;
    UI_SupportCenter: TiledLayer = null;
    UI_BigTower: TiledLayer = null;
    UI_DAOEX: TiledLayer = null;
    UI_EntertainmentArea_4: TiledLayer = null;
    UI_EntertainmentArea_3: TiledLayer = null;
    UI_EntertainmentArea_2: TiledLayer = null;
    UI_EntertainmentArea_1: TiledLayer = null;
    UI_ProjectsPark_null: TiledLayer = null; 
    UI_ProjectsPark_SG: TiledLayer = null;
    UI_ProjectsPark_HaiDAO: TiledLayer = null;
    UI_ProjectsPark_AMDAO: TiledLayer = null;
    UI_ProjectsPark_CC: TiledLayer = null; 
    UI_DAOGarden_HaiDAO: TiledLayer = null;
    UI_DAOGarden_SEEDAO: TiledLayer = null;
    UI_DAOGarden_AMDAO: TiledLayer = null;
    UI_DAOGarden_null: TiledLayer = null; 
    UI_DAO_null: TiledLayer = null;
    UI_DAO_AMDAO: TiledLayer = null;
    UI_DAO_HaiDAO: TiledLayer = null;
    UI_DAO_SEEDAO: TiledLayer = null;
    /** seedao需互动layer */
    SheJiGongHui_NPC_Trigger: TiledLayer = null;
    ZhiLiGongHui_NPC_Trigger: TiledLayer = null;
    TouYanGongHui_NPC_Trigger: TiledLayer = null;
    KaiFaZheGongHui_NPC_Trigger: TiledLayer = null;
    YiShuGongHui_NPC_Trigger: TiledLayer = null;
    JianZhuGongHui_NPC_Trigger: TiledLayer = null;
    XuanChuanGongHui_NPC_Trigger: TiledLayer = null;
    ChanPinGongHui_NPC_Trigger: TiledLayer = null;
    FanYiGongHui_NPC_Trigger: TiledLayer = null;
    NFT_Club_NPC_Trigger: TiledLayer = null;
    SheJiGongHui_onboarding_a: TiledLayer = null;
    SheJiGongHui_onboarding_b: TiledLayer = null;
    SheJiGongHui_onboarding_c: TiledLayer = null;
    TouYanGongHui_onboarding_a: TiledLayer = null;
    TouYanGongHui_onboarding_b: TiledLayer = null;
    TouYanGongHui_onboarding_c: TiledLayer = null;
    KaiFaGongHui_onboarding_a: TiledLayer = null;
    KaiFaGongHui_onboarding_b: TiledLayer = null;
    KaiFaGongHui_onboarding_c: TiledLayer = null;
    YiShuGongHui_onboarding_a: TiledLayer = null;
    YiShuGongHui_onboarding_b: TiledLayer = null;
    XuanChuanGongHui_onboarding_a: TiledLayer = null;
    XuanChuanGongHui_onboarding_b: TiledLayer = null;
    XuanChuanGongHui_onboarding_c: TiledLayer = null;
    ChanPinGongHui_onboarding_a: TiledLayer = null;
    ChanPinGongHui_onboarding_b: TiledLayer = null;
    ChanPinGongHui_onboarding_c: TiledLayer = null;
    FanYiGongHui_onboarding_a: TiledLayer = null;
    FanYiGongHui_onboarding_b: TiledLayer = null;
    FanYiGongHui_onboarding_c: TiledLayer = null;
    seedaoBookshelf_a: TiledLayer = null;
    seedaoBookshelf_b: TiledLayer = null;
    seedaoBookshelf_c: TiledLayer = null;
    seedaoBookshelf_d: TiledLayer = null;
    seedaoBookshelf_e: TiledLayer = null;
    seedaoBookshelf_f: TiledLayer = null;
    XiangMuKanBan: TiledLayer = null;
    TiAnBan: TiledLayer = null;
    FengYunBang: TiledLayer = null;
    ShangJinRenWu: TiledLayer = null;
    HuoDongRiLi: TiledLayer = null;
    gameRoom_White: TiledLayer = null;
    gameRoom_Red: TiledLayer = null;
    gameRoom_Blue: TiledLayer = null;
    gameRoom_Yellow: TiledLayer = null;
    cinema: TiledLayer = null;
    musicMicrophone: TiledLayer = null;
    musicGuitar: TiledLayer = null;
    musicDrum: TiledLayer = null;
    musicPaino: TiledLayer = null;
    HuoDongKanBan: TiledLayer = null;
    seedaoWhiteBoard: TiledLayer = null;
    FanYiGongHui_bountyBoard: TiledLayer = null;
    ChanPinGongHui_bountyBoard: TiledLayer = null;
    XuanChuanGongHui_bountyBoard: TiledLayer = null;
    YiShuGongHui_bountyBoard: TiledLayer = null;
    KaiFaGongHui_bountyBoard: TiledLayer = null;
    TouYanGongHui_bountyBoard: TiledLayer = null;
    ZhiLiGongHui_bountyBoard: TiledLayer = null;
    SheJiGongHui_bountyBoard: TiledLayer = null;
    FanYiGongHui_bookshelf_a: TiledLayer = null;
    FanYiGongHui_bookshelf_b: TiledLayer = null;
    FanYiGongHui_bookshelf_c: TiledLayer = null;
    FanYiGongHui_bookshelf_d: TiledLayer = null;
    FanYiGongHui_bookshelf_e: TiledLayer = null;
    FanYiGongHui_bookshelf_f: TiledLayer = null;
    ChanPinGongHui_bookshelf_a: TiledLayer = null;
    ChanPinGongHui_bookshelf_b: TiledLayer = null;
    ChanPinGongHui_bookshelf_c: TiledLayer = null;
    ChanPinGongHui_bookshelf_d: TiledLayer = null;
    ChanPinGongHui_bookshelf_e: TiledLayer = null;
    ChanPinGongHui_bookshelf_f: TiledLayer = null;
    XuanChuanGongHui_bookshelf_a: TiledLayer = null;
    XuanChuanGongHui_bookshelf_b: TiledLayer = null;
    XuanChuanGongHui_bookshelf_c: TiledLayer = null;
    XuanChuanGongHui_bookshelf_d: TiledLayer = null;
    XuanChuanGongHui_bookshelf_e: TiledLayer = null;
    XuanChuanGongHui_bookshelf_f: TiledLayer = null;
    YiShuGongHui_bookshelf_a: TiledLayer = null;
    YiShuGongHui_bookshelf_b: TiledLayer = null;
    YiShuGongHui_bookshelf_c: TiledLayer = null;
    YiShuGongHui_bookshelf_d: TiledLayer = null;
    YiShuGongHui_bookshelf_e: TiledLayer = null;
    YiShuGongHui_bookshelf_f: TiledLayer = null;
    KaiFaGongHui_bookshelf_a: TiledLayer = null;
    KaiFaGongHui_bookshelf_b: TiledLayer = null;
    KaiFaGongHui_bookshelf_c: TiledLayer = null;
    KaiFaGongHui_bookshelf_d: TiledLayer = null;
    KaiFaGongHui_bookshelf_e: TiledLayer = null;
    KaiFaGongHui_bookshelf_f: TiledLayer = null;
    TouYanGongHui_bookshelf_a: TiledLayer = null;
    TouYanGongHui_bookshelf_b: TiledLayer = null;
    TouYanGongHui_bookshelf_c: TiledLayer = null;
    TouYanGongHui_bookshelf_d: TiledLayer = null;
    TouYanGongHui_bookshelf_e: TiledLayer = null;
    TouYanGongHui_bookshelf_f: TiledLayer = null;
    SheJiGongHui_bookshelf_a: TiledLayer = null;
    SheJiGongHui_bookshelf_b: TiledLayer = null;
    SheJiGongHui_bookshelf_c: TiledLayer = null;
    SheJiGongHui_bookshelf_d: TiledLayer = null;
    SheJiGongHui_bookshelf_e: TiledLayer = null;
    SheJiGongHui_bookshelf_f: TiledLayer = null;


    /** hydao需互动layer */
    ChanPinLanMu: TiledLayer = null;
    BoKeLanMu: TiledLayer = null;
    GongXianBang: TiledLayer = null;
    DAOShiJianBiao: TiledLayer = null;
    ZhiBoZu: TiledLayer = null;
    BianJiZu: TiledLayer = null;
    XuanChuanZu: TiledLayer = null;
    YunYingZu: TiledLayer = null;
    ZhiLiZu: TiledLayer = null;
    ZiLiaoGuan: TiledLayer = null;
    CaiWuShi: TiledLayer = null;
    GongJuJi: TiledLayer = null;


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
    buildingID: number = -1;
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