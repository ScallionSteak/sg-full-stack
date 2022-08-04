/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 09:48:11
 */

import { LayerType, UIConfig } from "../../../../../extensions/oops-framework/assets/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable,
    /** 登录界面 */
    Demo_Gate,
    /** 角色控制器 */
    Demo_Role_Controller,
    /** 匹配界面（现用为选角界面） */
    Demo_Match,
    /** 单条聊天记录-自己 */
    Demo_ChatTextFromSelf,
    /** 单条聊天记录-其他人 */
    Demo_ChatTextFromOthers,
    /** 赏金任务list面板 */
    Demo_bountyDashboard,
    /** DAO garden面板 */
    Demo_daoGarden,
    /** projects park面板 */
    Demo_projectsPark,
    /** 赏金任务面板 */
    Demo_bountyBoard,
    /** 钱包面板 */
    Demo_wallet,
    /** 会议面板 */
    Demo_meeting,
    /** 个人中心面板 */
    Demo_personalCenter,
    /** NPC对话 */
    Demo_npcDialog,
    /** 小地图介绍界面 */
    Demo_miniMapIntroduction,
    /** 赏金任务详细面板 */
    Demo_bountyDetails,
    /** webview */
    Demo_webview800600,
    /** d2d合作社 */
    Demo_d2dSquare,
    /** 钟楼 */
    Demo_bigTower
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Demo_Gate]: { layer: LayerType.UI, prefab: "gui/gate/game_login" },
    [UIID.Demo_Role_Controller]: { layer: LayerType.UI, prefab: "gui/game/role_controller" },
    [UIID.Demo_Match]: { layer: LayerType.UI, prefab: "gui/match/match" },
    [UIID.Demo_ChatTextFromSelf]: { layer: LayerType.UI, prefab: "gui/game/singleChatFromSelf" },
    [UIID.Demo_ChatTextFromOthers]: { layer: LayerType.UI, prefab: "gui/game/singleChatFromOthers" },
    [UIID.Demo_bountyDashboard]: { layer: LayerType.UI, prefab: "gui/game/bountyDashboard" },
    [UIID.Demo_daoGarden]: { layer: LayerType.UI, prefab: "gui/game/daoGarden" },
    [UIID.Demo_projectsPark]: { layer: LayerType.UI, prefab: "gui/game/projectsPark" },
    [UIID.Demo_bountyBoard]: { layer: LayerType.UI, prefab: "gui/game/bountyBoard" },
    [UIID.Demo_wallet]: { layer: LayerType.UI, prefab: "gui/game/wallet" },
    [UIID.Demo_meeting]: { layer: LayerType.UI, prefab: "gui/game/meeting" },
    [UIID.Demo_personalCenter]: { layer: LayerType.UI, prefab: "gui/game/personalCenter" },
    [UIID.Demo_npcDialog]: { layer: LayerType.UI, prefab: "gui/game/npcDialog" },
    [UIID.Demo_miniMapIntroduction]: { layer: LayerType.UI, prefab: "gui/game/miniMapIntroduction" },
    [UIID.Demo_bountyDetails]: { layer: LayerType.UI, prefab: "gui/game/bountyDetails" },
    [UIID.Demo_webview800600]: { layer: LayerType.UI, prefab: "gui/game/webview800600" },
    [UIID.Demo_d2dSquare]: { layer: LayerType.UI, prefab: "gui/game/d2dSquare" },
    [UIID.Demo_bigTower]: { layer: LayerType.UI, prefab: "gui/game/bigTower" },
}