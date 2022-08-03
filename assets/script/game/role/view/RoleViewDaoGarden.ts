/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, sys, v3, Vec3, _decorator } from 'cc';
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
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewDaoGarden")
@ecs.register('RoleViewDaoGarden', false)
export class RoleViewDaoGarden extends CCComp {

    @property({ type: Node })
    detailsLayer: Node = null!;

    closeSelf() {
        oops.gui.remove(UIID.Demo_daoGarden);
    }

    openLink(event: any, customEventData: string) {
        switch (customEventData) {
            case 'twitter':
                var link = 'http://twitter.com/see_dao'
                break;
            case 'discord':
                var link = 'https://t.co/abvfkG7dtv'
                break;
            case 'mirror':
                var link = 'https://mirror.xyz/seedao.eth'
                break;
            case 'website':
                var link = 'https://www.seedao.xyz/'
                break;
            case 'wechat':
                var link = 'https://mp.weixin.qq.com/s/vNcOSCDgZJjplqnYBUoJfA'
                break;
            default:
                break;
        }
        sys.openURL(link);
    }

    reset(): void {

    }
}