/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Layout, Node, Prefab, UITransformComponent, v3, Vec3, _decorator } from 'cc';
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
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { RoleViewBountyListItem } from './RoleViewBountyListItem';
import { RoleViewd2dItem } from './RoleViewd2dItem';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewD2dSquare")
@ecs.register('RoleViewD2dSquare', false)
export class RoleViewD2dSquare extends CCComp {

    @property({ type: Node })
    d2dItemListLayer: Node = null!;
    @property({ type: Prefab })
    d2dItemPrefab: Prefab = null!;

    private d2dItemData: {title: string, publishDate: string, endDate: string, desc: string, pic1: string, pic2: string, contactPortrait: string, contactName: string, contactDao: string}[] = [
        {
            title: 'definder招募合作的DAO',
            publishDate: '2022-08-01',
            endDate: '2022-09-01',
            desc: '我自己和兄弟在运营一个纯度极高的高质量从业人社区，也做了几期创始人深度专访，包括jediswap币圈煤老板、panda dao，也在definder帮忙，链上数据分析工具，同时也是“币圈煤老板”的运营搭档，也是jaydao builder。之前曾在某dex全职，然后自己是个韭菜散户这样，目前正在为definder招募合作的DAO！',
            pic1: 'd2dItem1Pic1',
            pic2: 'd2dItem1Pic1',
            contactPortrait: 'd2dItem1Pic1',
            contactName: 'KevinHe (CT studio)',
            contactDao: 'DXDAO'
        },
        {
            title: '“创作者经济”话题AMA，期待大家的加入',
            publishDate: '2022-07-31',
            endDate: '2022-08-07',
            desc: '大家好！这里是HYDAO海盗电台~\r\n我们正在计划开展一场关于“创作者经济”话题的AMA，创作者经济为什么成了热门话题？它会为我们带来哪些机遇？海盗电台将首度联麦小岛美奈子@MinakoOikawa，欢迎感兴趣的DAO友一起来聊聊！',
            pic1: 'd2dItem2Pic1',
            pic2: '',
            contactPortrait: 'd2dItem2Pic2',
            contactName: 'OxRick',
            contactDao: 'HYDAO'
        },
        {
            title: '招募对SBT感兴趣的朋友，大家一起来玩',
            publishDate: '2022-07-28',
            endDate: '2022-08-28',
            desc: 'Hi，这里是LXDAO！有对 SBT 感兴趣的dao友吗？我们正在招募一个 SBT 研究小组，不仅仅讨论分享论文、资料和最新产品，还会基于 SBT 落地一些产品，产出一些文章或者论文。欢迎有兴趣或者身边对 SBT 感兴趣的友友们联系我们！谢谢！',
            pic1: '',
            pic2: '',
            contactPortrait: 'd2dItem3Pic1',
            contactName: 'brucexu',
            contactDao: 'LXDAO'
        },
        {
            title: 'Web3领域招聘平台，寻找投资/孵化',
            publishDate: '2022-07-23',
            endDate: '2022-09-23',
            desc: 'FutureX，专注于互联网领域的招聘平台，目前团队在寻找投资/孵化，创始团队均来自于哈佛，感兴趣的团队，可以联系我们！',
            pic1: '',
            pic2: '',
            contactPortrait: '',
            contactName: 'NACE',
            contactDao: 'FUDAO'
        },
        {
            title: '邀请艺术家们参与水泥公园的艺术节',
            publishDate: '2022-07-15',
            endDate: '2022-08-15',
            desc: '大家好,这里是水泥公园~\r\n水泥公园LIVEHOUSE自2017年12月22日开始于上海，每周一期开放实施，主要关注行为、剧场、表演、声音等艺术形式，目前已经持续进行到162期，给国内外300多位艺术家提供了交流实践的平台。今年计划邀请一些上海之外的艺术家参与艺术节，并为他们提供交通费和住宿，特别开心有机会在这里上看到众多神秘朋友的头像，欢迎入驻的dao艺术家们来骚扰!希望后面能有更多的碰撞，最后我们会在元宇宙上开公园，八咯牙路er~\r\n另外上海地区有合适的举办活动的场地、住宿的地方，也欢迎给我们联系合作。',
            pic1: 'd2dItem5Pic1',
            pic2: '',
            contactPortrait: 'd2dItem5Pic2',
            contactName: '拿铁大王',
            contactDao: '水泥公园'
        },
        {
            title: '“web3人人造星”活动招募参与者',
            publishDate: '2022-07-13',
            endDate: '2022-07-23',
            desc: '大家好，这里是AM Dao~\r\n“web3人人造星”，“创世星”选拔赛，作品征集于今日正式开始！\r\n艺术音乐创作者请点击链接https://bit.ly/3yZjGM4上传作品，并扫描海报上二维码进微信群了解比赛投票时间。\r\n人人参与、人人决策、人人获益！所有人都可以扫描海报上二维码进群参与活动，提前了解参赛选手及作品，有机会成为“创世星”的经纪人共同享受艺术音乐作品收益。\r\n欢迎入驻DAO的小伙伴们一起参与web3人人造星活动！',
            pic1: 'd2dItem6Pic1',
            pic2: '',
            contactPortrait: 'd2dItem6Pic2',
            contactName: 'PinkPing',
            contactDao: 'AMDAO'
        },
        {
            title: '寻求合作-传统手游改NFT项目',
            publishDate: '2022-07-13',
            endDate: '2022-10-13',
            desc: '《寻求合作-传统手游改NFT项目》\r\n简介：这是我在几年前做的一款avater拼人游戏，用各种手，脚，头，身体等组件，然后用户可以选择一个pose，自己DIY可以合成个性化的角色动态或静态卡片游戏视频：\r\nhttps://www.facebook.com/488852595255719/videos/578170202947500/\r\nhttps://fb.watch/eEESGnBbHo/\r\n我想找的合作伙伴：\r\n1-资金投入，一起把项目做出来\r\n2-懂包装运营NFT的，一起把项目做成功',
            pic1: '',
            pic2: '',
            contactPortrait: '',
            contactName: 'Aoo',
            contactDao: 'TGDAO'
        },
        {
            title: '寻找对时尚感兴趣的合作者～',
            publishDate: '2022-07-11',
            endDate: '2022-08-11',
            desc: 'REBOOT.FASHION的 co-founder，这是一本社区驱动的杂志。社区的所有成员都可以深度参与杂志的发展，共同推动web3在时尚行业的应用。我们作为时尚创作者的枢纽和启动平台，致力于帮助更多的web2时尚创作者和爱好者加入web3。 并推动独立创作者获得更多的受众和机会。\r\n我们正在寻找对web3时尚感兴趣的编辑、设计师和时尚爱好者加入我们! 参与我们社区的日常时尚讨论，并了解最新的新闻。作为共同创造者参与每期内容的创造和决策！',
            pic1: '',
            pic2: '',
            contactPortrait: '',
            contactName: 'Boo',
            contactDao: 'FOUNDDAO'
        },
        {
            title: '对web3知识付费感兴趣的，可以加入我们',
            publishDate: '2022-07-08',
            endDate: '2022-10-08',
            desc: '大家好，我是FAN，base北京杭州，目前国内合伙有一营销公司，年规模1亿左右。目前除传统业务外，还在探索国内web2.5，两个方向：\r\n1）针对国内用户的web2.5/web3知识付费项目；\r\n2）帮助国内品牌完成营销链改升级。\r\n需求：\r\n1）欢迎感兴趣的web3讲师、课程产品运营、招生运营及内容运营的小伙伴找我聊聊业务；\r\n2）感兴趣的web3游戏/ 社交产品经理，联盟链合约工程师，全栈工程师找我聊聊业务',
            pic1: '',
            pic2: '',
            contactPortrait: '',
            contactName: 'FAN',
            contactDao: 'UYTDAO'
        }
    ];
    private listHeight;

    onLoad() {
        this.initList();
    }

    initList() {
        for (var i = 0; i < this.d2dItemData.length; i++) {
            var node = instantiate(this.d2dItemPrefab);
            node.parent = this.d2dItemListLayer;
            node.getComponent(RoleViewd2dItem).initData(this.d2dItemData[i]);
            this.listHeight = node.getComponent(UITransformComponent).height + this.d2dItemListLayer.getComponent(Layout).spacingY;
        }
        this.d2dItemListLayer.getComponent(UITransformComponent).setContentSize(this.d2dItemListLayer.getComponent(UITransformComponent).width, this.listHeight * Math.trunc(1 + this.d2dItemData.length / 3));
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_d2dSquare);
    }

    reset(): void {

    }
}