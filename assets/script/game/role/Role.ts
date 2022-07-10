import { Node } from "cc";
import { Logger } from "../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { UICallbacks } from "../../../../extensions/oops-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../extensions/oops-framework/assets/core/Oops";
import { ViewUtil } from "../../../../extensions/oops-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { RoleModelComp } from "./model/RoleModelComp";
import { RoleViewComp } from "./view/RoleViewComp";
import { RoleViewUIComp } from "./view/RoleViewUIComp";

/** Player 模块 */
export class Role extends ecs.Entity {
    RoleModel!: RoleModelComp;

    RoleView!: RoleViewComp;

    /** 实始添加的数据层组件 */
    protected init() {
        this.addComponents<RoleModelComp>(RoleModelComp);
    }

    /** 释放角色对象 */
    destroy(): void {
        Logger.logBusiness(`【角色】释放角色 - ${this.RoleModel.nickname}`);
        this.remove(RoleViewComp);

        super.destroy();
    }

    /** 加载模型 */
    load(parent: Node, callback?: Function) {
        var path = this.RoleModel.res;
        ViewUtil.loadPrefabNode(path, (node: Node) => {
            // 注：防一个客户端切到后面，一个玩家加入又退出时，玩家模型资源后，玩家对象被释放了
            if (this.RoleModel) {
                var node = ViewUtil.createPrefabNode(path);
                var rv = node.getComponent(RoleViewComp)!;
                node.parent = parent;
                this.add(rv);

                callback && callback(node);
            }
            else {
                node.destroy();
            }
        });
    }

    /** 加载空间的界面，分公共空间和DAO专属空间，未来还可能有私人房间 */
    loadSpaceUI() {
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                var comp = node.getComponent(RoleViewUIComp) as ecs.Comp;
                this.add(comp);
            }
        };
        oops.gui.open(UIID.Demo_Role_Controller, null, uic);
    }

    loadChatUI() {
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                var comp = node.getComponent(RoleViewUIComp) as ecs.Comp;
                this.add(comp);
            }
        };
        oops.gui.open(UIID.Demo_Chat, null, uic);
    }
}

/** Player 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsRoleSystem extends ecs.System {
    constructor() {
        super();

        // this.add(new ecs.ComblockSystem());
    }
}
