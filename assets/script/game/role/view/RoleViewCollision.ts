/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 14:04:35
 */

import { Collider, Node, Collider2D, Contact2DType, IPhysics2DContact, tween, TweenSystem, Vec3, _decorator, find } from "cc";
import { MoveTo } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTo";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Player } from "../../../../../tsrpc_server/src/module/player/Player";
import { PlayerPosition } from "../../../tsrpc/types/PlayerState";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { CCComp } from "../../common/ecs/view/CCComp";
import { RoleModelComp } from "../model/RoleModelComp";
import { Role } from "../Role";
import { RoleViewCharactor } from "./RoleViewCharactor";
import { RoleViewComp } from "./RoleViewComp";
import { RoleViewUIComp } from "./RoleViewUIComp";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewCollision')
export class RoleViewCollision extends CCComp {

    private LayerUINode;
    private playerNode;

    onLoad() {
        var collider = this.node.getComponent(Collider);
        collider.on("onCollisionEnter", this.onBeginContact, this);
        collider.on("onCollisionExit", this.onEndContact, this);
    }

    onBeginContact(self) {
        var selfNode: Node = self.selfCollider.node.parent;
        var myself: Role = selfNode.getComponent(RoleViewComp).ent as Role;
        if (smc.room.RoomModel.owner.RoleModel.id == myself.RoleModel.id) {
            var role_controller = find("root/gui/LayerUI/role_controller");
            role_controller.getComponent(RoleViewUIComp).showPlayerPopupLayer(myself.RoleModel.id);
            var otherNode: Node = self.otherCollider.node.parent;
            var other: Role = otherNode.getComponent(RoleViewComp).ent as Role;
            role_controller.getComponent(RoleViewUIComp).collisionSelf = myself;
            role_controller.getComponent(RoleViewUIComp).collisionOther = other;
        }        
    }

    onEndContact(self) {
        var selfNode: Node = self.selfCollider.node.parent;
        var myself: Role = selfNode.getComponent(RoleViewComp).ent as Role;
        if (smc.room.RoomModel.owner.RoleModel.id == myself.RoleModel.id) {
            var role_controller = find("root/gui/LayerUI/role_controller");
            role_controller.getComponent(RoleViewUIComp).closePlayerPopupLayer(myself.RoleModel.id);
        }
    }

    reset() {
        this.node.destroy();
    }
}