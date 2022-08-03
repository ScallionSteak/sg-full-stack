/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, RichText, v3, Vec3, _decorator } from 'cc';
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
import { DelegateComponent } from '../../../../../extensions/oops-framework/assets/core/gui/layer/DelegateComponent';
import { RoleViewProjectsParkLinkPrefab } from './RoleViewProjectsParkLinkPrefab';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewProjectsPark")
@ecs.register('RoleViewProjectsPark', false)
export class RoleViewProjectsPark extends CCComp {

    @property({ type: Node })
    projectNameNode: Node = null!;
    @property({ type: Node })
    projectDescNode: Node = null!;
    @property({ type: Prefab })
    projectLinksPrefab: Prefab = null!;
    @property({ type: Node })
    projectContactNode: Node = null!;
    @property({ type: Node })
    prefabListLayer: Node = null!;

    public id = 0;

    private projectName: string[] = [
        '孵化器 C-Combinator',
        'Web3人人造星'
    ];
    private projectDesc: string[] = [
        'SeeDAO 是一个/基于/社区预测协议的/ DAO 的孵化器。坚持 DAO IT, DO IT, 信奉 Co-build, Co-share。C-Combinator 是 SeeDAO 推出的社区孵化平台，旨在为 Web3 创业者提供最前沿的教学指导、强大的校友网络与社区支持，成为 Web3 的创新助产师。',
        'AM DAO是web3的艺术类去中心化组织，打造加密世界顶级文艺娱乐社区。社区聚集创作者和爱好者，构建文艺活动平台，社区内有NFT作品主题创作、作品宣传发售、元宇宙场景互动场所等文艺生态。\r\n\r\n“人人造星”是系列主题活动，这次是第一期活动。每次“人人造星”活动，都会由明星艺人、和对应的明星作品，都要给相应的title。'
    ];
    private projectContact: string[] = [
        'Tx#2221',
        'PinkPing AM Dao 加密世界顶级文艺娱乐社区#5339'
    ];

    private ccLinks: { linkName: string, linkAddress: string }[] = [
        { linkName: '什么是 SeeDAO 孵化计划?', linkAddress: 'https://seedao-c-combinator.gitbook.io/product-docs/fu-hua-gui-ze/mvp-fu-dao-gui-ze' },
        { linkName: '孵化大赛策划', linkAddress: 'https://dazzling-shrimp-42c.notion.site/fcec8bd8beb740479a55a53535673203' },
        { linkName: 'SeeDAO 孵化计划（S1）执行方案', linkAddress: 'https://rowan-mollusk-a75.notion.site/SeeDAO-S1-8b5e89b4dad542c1b4d5a01c7d47b366' },
        { linkName: '如何参与孵化器项目？', linkAddress: 'https://rowan-mollusk-a75.notion.site/e9d96973fec846b6856631c9212d9d66' },
        { linkName: 'C-Combinator官网', linkAddress: 'http://beta.seedao.cc/' }
    ];
    private amdaoLinks: { linkName: string, linkAddress: string }[] = [
        { linkName: '人人造星活动方案', linkAddress: 'https://heavy-language-a56.notion.site/a5a7b18427b74f93bb663b5d8e457e02' },
        { linkName: '投稿参赛（已结束）', linkAddress: 'https://airtable.com/shrgfx2NL5XfFSuaE' },
        { linkName: '参赛选手绑定电子钱包链接', linkAddress: 'https://airtable.com/shrnTEo7Otb6HI2Z9' }
    ];

    private allLinks = [];

    onLoad() {
        this.allLinks.push(this.ccLinks);
        this.allLinks.push(this.amdaoLinks);
        this.initContent();
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_projectsPark);
    }

    initContent() {
        console.log(this.node);
        this.id = this.node.getComponent(DelegateComponent).viewParams.params - 1; //不知道为什么，穿0进来就不认，所以只能穿过来做减法
        this.projectNameNode.getComponent(Label).string = this.projectName[this.id];
        this.projectDescNode.getComponent(Label).string = this.projectDesc[this.id];
        this.projectContactNode.getComponent(Label).string = this.projectContact[this.id];

        console.log(this.id);
        console.log(this.allLinks);
        console.log(this.allLinks[this.id].length);
        for (var i = 0; i < this.allLinks[this.id].length; i++) {
            var node = instantiate(this.projectLinksPrefab);
            node.parent = this.prefabListLayer;
            node.getComponent(RoleViewProjectsParkLinkPrefab).initContent(this.allLinks[this.id][i].linkName, this.allLinks[this.id][i].linkAddress);
        }
    }

    reset(): void {

    }
}