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
}