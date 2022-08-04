/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, v3, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { MapViewControl } from '../../scene/view/MapViewControl';
import { RoleViewBountyDetails } from './RoleViewBountyDetails';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewd2dItem")
@ecs.register('RoleViewd2dItem', false)
export class RoleViewd2dItem extends CCComp {

    @property({ type: Prefab })
    bountyDetailsPrefab: Prefab = null!;
    @property({ type: Node })
    bountyName: Node = null!;
    @property({ type: Node })
    bountyDesc: Node = null!;
    @property({ type: Node })
    bountyCreator: Node = null!;
    @property({ type: Node })
    bountyPrice: Node = null!;

    private bountyInfo;
    initData(bountyListItem: any) {
        this.bountyInfo = bountyListItem;
        this.bountyName.getComponent(Label).string = bountyListItem.bountyName;
        this.bountyDesc.getComponent(Label).string = String(bountyListItem.bountyDesc).substring(1,10) + '...';
        this.bountyCreator.getComponent(Label).string = bountyListItem.bountyCreator;
        this.bountyPrice.getComponent(Label).string = bountyListItem.bountyPrice;
    }

    showDetails() {
        var node = instantiate(this.bountyDetailsPrefab);
        node.parent = this.node.parent.parent.parent.parent.parent.parent.parent;
        node.getComponent(RoleViewBountyDetails).initDetailsData(this.bountyInfo);
    }

    reset(): void {

    }
}