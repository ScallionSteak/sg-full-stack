/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, Sprite, SpriteAtlas, sys, v3, Vec3, _decorator } from 'cc';
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
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewDaoGarden")
@ecs.register('RoleViewDaoGarden', false)
export class RoleViewDaoGarden extends CCComp {

    @property({ type: Node })
    daoName: Node = null!;
    @property({ type: Node })
    daoLogo: Node = null!;
    @property({ type: Node })
    daoSlogan: Node = null!;
    @property({ type: Node })
    daoDesc: Node = null!;
    @property({type: SpriteAtlas})
    UIAtlas: SpriteAtlas = null!;

    private daoID = 0;

    onLoad() {
        this.daoID = this.node.getComponent(DelegateComponent).viewParams.params;
        this.initDaoInfo();
    }

    initDaoInfo(){
        switch (this.daoID) {
            case 1:
                this.daoName.getComponent(Label).string = "HYDAO";
                this.daoLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("main/hydaoLogo");
                this.daoSlogan.getComponent(Label).string = "";
                this.daoDesc.getComponent(Label).string = "HYDAO海盗电台是一个创作音频内容的去中心化组织，所创作的音频形式上以播客和语音直播为主，内容是以Web3话题为主。HYDAO使用去中心化自治的模式来实现治理、生产内容、促进协作、吸引听众并产生影响。在音频创作方面，HYDAO追求制播流程、水准与内容的专业性。在治理方面，HYDAO本身是一个媒体DAO，遵循并灵活使用DAO的治理原则。";
                break;
            case 2:
                this.daoName.getComponent(Label).string = "SeeDAO";
                this.daoLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("daogarden/seedaoLogoRound");
                this.daoSlogan.getComponent(Label).string = "DAO it! Do it!";
                this.daoDesc.getComponent(Label).string = "SeeDAO是一个DAO的孵化器，也是华语世界影响力最大的DAO。SeeDAO致力于为华语世界培养DAO的人才，营造适合Web3创新发生的氛围，促使Web3先锋的理念、产品和内容在这里诞生。\r\n截至目前，SeeDAO已形成翻译、宣传、运营、设计、艺术、建筑、产品、开发、投研、NFT Club这十个公会。社区成员接近8000人，实质贡献者超过了600名。此外，SeeDAO已经完成了估值3000万美金的A轮融资，投资人包括HashKey Capital、HashGlobal、Nervos、Tess Venture、MaskNetwork、ChainIDE、火凤资本。\r\nSeeDAO有两个原则。一个是“DAO it，DO it”，即不仅要强调DAO的理念和金融，更强调DAO的实践和具体建设。另一个是“Co - build，Co - share”，即社区共建的果实由付出劳动的成员共同分享。";
                break;
            case 3:
                this.daoName.getComponent(Label).string = "AM DAO";
                this.daoLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("main/amdaoLogo");
                this.daoSlogan.getComponent(Label).string = "加密世界顶级文艺娱乐社区";
                this.daoDesc.getComponent(Label).string = "AM DAO 致力于打造加密世界顶级文艺娱乐社区 ; “A”和“M”分别对应 “Art”艺术“Music”音乐 面向全球热爱艺术音乐的 Z 世代及 Web3 新生力量。AM DAO 发起“文艺大迁徙计划”，旨在帮助更多的艺术音乐 创作新人迁徙至 Web3 世界，并在 Web3 世界培养孵化——游 戏化运作方式希望更多人参与赋能艺术与音乐作品，构建大家共 同的艺术音乐乌托邦;秉持“人人造星”、“人人是星”、“人人获星”的伯乐理念; 从第一阶段项目 Web3 人人造星开始，开启整个文艺大迁徙计 划宏伟篇章的序幕!";
                break;
            default:
                console.log("no such dao. some wrong here.");
                break;
        }
    }

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