/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 17:03:43
 */

import { EditBox, instantiate, Label, Node, Prefab, ScrollView, _decorator } from 'cc';
import { GameComponent } from '../../../../../extensions/oops-framework/assets/core/game/GameComponent';
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { LoadingViewComp } from '../../initialize/view/LoadingViewComp';
import { Room } from '../Room';
import { RoomEvent } from '../RoomEvent';
import { RoomEnterDaoBtnList } from './RoomEnterDaoBtnList';
import { RoomListItem } from './RoomListItem';
import { RoomReenterDaoBtnList } from './RoomReenterDaoBtnList';

const { ccclass, property } = _decorator;

@ccclass('RoomDaoList')
export class RoomDaoList extends GameComponent {

    @property(Prefab)
    prefabEnterDaoBtnListItem!: Prefab;

    onLoad() {
    }

    start() {
        this.loadRoomList();
    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                for (let roomInfo of ret.res.rooms) {
                    let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                    btnNode.getComponent(RoomReenterDaoBtnList).initRoomInfo(roomInfo);
                    btnNode.parent = this.node;
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }
}