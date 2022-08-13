/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, UITransformComponent, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { UICallbacks } from '../../../../../extensions/oops-framework/assets/core/gui/layer/Defines';
import { RoomUtil } from '../../room/bll/RoomUtil';
import { RoomReenterDaoBtnList } from '../../room/view/RoomReenterDaoBtnList';
import { MapViewControl } from '../../scene/view/MapViewControl';
import { RoomEnterDaoBtnList } from '../../room/view/RoomEnterDaoBtnList';
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { RoleViewMiniMapLocation } from './RoleViewMiniMapLocation';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewMiniMapIntroduction")
    @ecs.register('RoleViewMiniMapIntroduction', false)
export class RoleViewMiniMapIntroduction extends CCComp {

    @property({ type: Node })
    miniMapSprite: Node = null!;

    @property({ type: Node })
    playerOnMiniMap: Node = null!;

    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    @property({ type: Node })
    mapContent: Node = null!;

    @property({ type: Node })
    introductionTitle: Node = null!;

    @property({ type: Node })
    introductionDesc: Node = null!;

    @property(Prefab)
    miniMapLocation!: Prefab;

    public mvc = null;
    private pbLocationArr: { name: string, type: string, posX: number, posY: number, desc: string }[] = [
        { name: '建筑名称1', type: 'big', posX: -37, posY: -215, desc: '对该建筑的描述' },
        { name: 'test2', type: 'big', posX: 230, posY: 50, desc: 'hhhhhhhhhhhhh' },
        { name: 'test3', type: 'small', posX: 250, posY: 100, desc: 'iiiiiiiiiii' },
        { name: 'test4', type: 'big', posX: 270, posY: -100, desc: 'jjjjjjjjjjjj' },
        { name: 'test5', type: 'big', posX: 300, posY: -50, desc: 'kkkkkkkkkk' },
        { name: 'test6', type: 'small', posX: -120, posY: -20, desc: 'lllllllllllllll' },
    ];
    private seeDaoLocationArr: { name: string, type: string, posX: number, posY: number, desc: string }[] = [
        { name: 'SeeDAO展示馆', type: 'small', posX: -37, posY: -215, desc: '截至目前，SeeDAO已有十个公会。社区成员接近8000人，实质贡献者超过了/600名。此外，SeeDAO已经完成了估值3000万美金的A轮融资，投资人包括HashKey Capital、HashGlobal、Nervos、Tess Venture、MaskNetwork、ChainIDE、火凤资本。这里陈列了关于seedao的历史资料和档案，你可以在这里查阅一切关于seedao的故事~' },
        { name: '风云榜', type: 'big', posX: -172, posY: -205, desc: '社区的核心贡献者名单都显示在这里哦（期待你的上榜！）' },
        { name: '活动日历', type: 'small', posX: -122, posY: -235, desc: '你可以在这里查看社区最近正在举办活动，积极参加活动是最快融入社区的最佳方式之一！' },
        { name: '提案板', type: 'big', posX: -182, posY: -255, desc: '我们鼓励社区成员积极参与社区内容生态的共建，并乐于提供多方面的资源支持！你可以对上面已经显示的提案进行留言讨论；如果你已有一个非常完整的项目想法，且已经有一个小团队可以协调推进，你可以直接在此区域简述项目想法！' },
        { name: '项目看板', type: 'big', posX: -222, posY: -175, desc: '你可以在这里查看到社区正在创造的项目以及相关详情，看到感兴趣的项目就赶紧加入一起做项目的builder吧！' },
        { name: '赏金任务', type: 'small', posX: -122, posY: -175, desc: '这里会展示seedao社区和各公会的赏金任务，当你成为公会成员，就可以解锁这里的权限，赚取自己的第一桶金！(记得先去on boarding获取公会成员身份哦)' },
        { name: 'Web3大学', type: 'small', posX: 48, posY: -185, desc: '在Web3建设一座没有围墙的大学。让行业先驱决定方向，让学者决定方式，让学生决定课程。让“链上学术共同体”在这里发生。' },
        { name: 'Web3图书馆', type: 'small', posX: -282, posY: -235, desc: '以 Web3 形式建立 Web3 领域的图书馆，汇聚全球 Web3 世界各主题的文章、论文、视频等，编写摘要和标签，分类收录，做知识的策展，让所有人更高效地学习。并同期将所有内容译成中文，使中文世界能更便捷地获取 Web3 世界的知识。Web3 图书馆是由 SeeDAO 孵化，完全开源的知识共享平台，欢迎其他团队和 DAO 来创建自己感兴趣的主题，共建图书馆。' },
        { name: '公会办公区', type: 'small', posX: 38, posY: -105, desc: '公会办公区是SeeDao公会的驻地，是公会成员的聚集地。目前SeeDAO有翻译、宣传、治理、设计、艺术、建筑、产品、开发、投研、NFT Club十个公会，每个公会拥有独立的土地和建筑，让更多的创意和协作发生在这里！' },
        { name: '会议区', type: 'small', posX: -69, posY: 130, desc: '公会和社区的大小会议会在这里举行，每晚8点蹲守周会，有事没事欢迎参加~' },
        { name: '娱乐区', type: 'small', posX: 58, posY: 115, desc: '这里有游戏室、音乐台和电影院供成员一起玩耍！对！就是这里party！party！' },
        { name: '冥想区', type: 'small', posX: -327, posY: -145, desc: '进入冥想区，你将进入空灵状态，失去与外界的一切联系，接收不到社区任何消息提醒，直到你走出冥想区。' },
        { name: '小黑屋', type: 'small', posX: 338, posY: -315, desc: '在社区有恶性互动的成员会被关进小黑屋，坐牢！无法与他人交流，失去所有交互行为的权限！' },
    ];
    private HYDaoLocationArr: { name: string, type: string, posX: number, posY: number, desc: string }[] = [
        { name: '产品公会', type: 'small', posX: 0, posY: 100, desc: '最牛逼的产品都是这里做的，就问你你信不信吧' },
        { name: '公会2', type: 'big', posX: 50, posY: 100, desc: 'bbbbbbbbbbbb' },
        { name: '公会3', type: 'small', posX: 100, posY: 100, desc: 'ccccccccccccc' },
        { name: '公会4', type: 'big', posX: -50, posY: 100, desc: 'dddddddddd' },
        { name: '公会5', type: 'big', posX: -100, posY: 100, desc: 'eeeeeeeeeeee' },
        { name: '公会6', type: 'small', posX: -150, posY: 100, desc: 'ffffffffffff' },
    ];
    private AMDaoLocationArr: { name: string, type: string, posX: number, posY: number, desc: string }[] = [
        { name: '产品公会', type: 'small', posX: 0, posY: 100, desc: '最牛逼的产品都是这里做的，就问你你信不信吧' },
        { name: '公会2', type: 'big', posX: 50, posY: 100, desc: 'bbbbbbbbbbbb' },
        { name: '公会3', type: 'small', posX: 100, posY: 100, desc: 'ccccccccccccc' },
        { name: '公会4', type: 'big', posX: -50, posY: 100, desc: 'dddddddddd' },
        { name: '公会5', type: 'big', posX: -100, posY: 100, desc: 'eeeeeeeeeeee' },
        { name: '公会6', type: 'small', posX: -150, posY: 100, desc: 'ffffffffffff' },
    ];

    start() {
        this.initMiniMap();
        this.updatePlayerOnMiniMap();
    }

    initMiniMap() {
        this.mvc = smc.scene.MapView.node.getComponent(MapViewControl);
        var mapName = smc.room.RoomModel.roomName;
        this.miniMapSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('mini' + mapName);        
        this.createLocations(mapName);
        var arr = this.getLocationArr(mapName);
        this.introductionTitle.getComponent(Label).string = arr[0].name;
        this.introductionDesc.getComponent(Label).string = arr[0].desc;
    }

    createLocations(mapName: string) {
        var arr = this.getLocationArr(mapName);
        for (var i = 0; i < arr.length; i++) {
            var node = instantiate(this.miniMapLocation);
            node.parent = this.mapContent;
            node.setPosition(arr[i].posX, arr[i].posY);
            node.getComponent(RoleViewMiniMapLocation).initLocation(arr[i].name, arr[i].type, i);
        }
    }

    updatePlayerOnMiniMap() {
        var playerPos = this.mvc.getFollowPosition();
        var miniX = - playerPos.x * (this.miniMapSprite.getComponent(UITransformComponent).width / this.mvc.width);
        var miniY = - playerPos.y * (this.miniMapSprite.getComponent(UITransformComponent).height / this.mvc.height);
        this.playerOnMiniMap.setPosition(miniX, miniY, 0);
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_miniMapIntroduction);
    }

    showIntroduction(locationID: number) {
        var mapName = smc.room.RoomModel.roomName;
        var arr = this.getLocationArr(mapName);
        this.introductionTitle.getComponent(Label).string = arr[locationID].name;
        this.introductionDesc.getComponent(Label).string = arr[locationID].desc;
    }

    getLocationArr(mapName: string) {
        var arr = [];
        switch (mapName) {
            case 'PublicSpaceRoom':
                arr = this.pbLocationArr;
                break;
            case 'SeeDAORoom':
                arr = this.seeDaoLocationArr;
                break;
            case 'HYDAORoom':
                arr = this.HYDaoLocationArr;
                break;
            case 'AMDAORoom':
                arr = this.AMDaoLocationArr;
                break;
            default:
                console.log('wrong dao room name.');
                break;
        }
        return arr;
    }

    update() {
    }

    reset(): void {

    }
}