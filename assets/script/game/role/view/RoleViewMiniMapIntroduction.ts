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
        { name: '建筑名称1', type: 'big', posX: 200, posY: 20, desc: '对该建筑的描述' },
        { name: 'test2', type: 'big', posX: 230, posY: 50, desc: 'hhhhhhhhhhhhh' },
        { name: 'test3', type: 'small', posX: 250, posY: 100, desc: 'iiiiiiiiiii' },
        { name: 'test4', type: 'big', posX: 270, posY: -100, desc: 'jjjjjjjjjjjj' },
        { name: 'test5', type: 'big', posX: 300, posY: -50, desc: 'kkkkkkkkkk' },
        { name: 'test6', type: 'small', posX: -120, posY: -20, desc: 'lllllllllllllll' },
    ];
    private seeDaoLocationArr: { name: string, type: string, posX: number, posY: number, desc: string }[] = [
        { name: '产品公会', type: 'small', posX: 0, posY: 100, desc: '最牛逼的产品都是这里做的，就问你你信不信吧' },
        { name: '公会2', type: 'big', posX: 50, posY: 100, desc: 'bbbbbbbbbbbb' },
        { name: '公会3', type: 'small', posX: 100, posY: 100, desc: 'ccccccccccccc' },
        { name: '公会4', type: 'big', posX: -50, posY: 100, desc: 'dddddddddd' },
        { name: '公会5', type: 'big', posX: -100, posY: 100, desc: 'eeeeeeeeeeee' },
        { name: '公会6', type: 'small', posX: -150, posY: 100, desc: 'ffffffffffff' },
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