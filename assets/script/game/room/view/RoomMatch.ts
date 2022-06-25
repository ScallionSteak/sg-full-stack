/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 17:03:43
 */

import { EditBox, instantiate, Label, Node, Prefab, ScrollView, _decorator } from 'cc';
import { GameComponent } from '../../../../../extensions/oops-framework/assets/core/game/GameComponent';
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { LoadingViewComp } from '../../initialize/view/LoadingViewComp';
import { Room } from '../Room';
import { RoomEvent } from '../RoomEvent';
import { RoomListItem } from './RoomListItem';

const { ccclass, property } = _decorator;

const RANDOM_NAMES = ['刘备', '诸葛亮', '关羽', '张飞', '赵云', '黄忠', '马超', '曹操', '夏侯敦', '夏侯渊', '曹仁', '曹洪', '孙权', '周瑜', '周泰', '吕布']

@ccclass('RoomMatch')
export class RoomMatch extends GameComponent {
    @property(EditBox)
    inputNickname!: EditBox;
    @property(ScrollView)
    roomList!: ScrollView;
    @property(Label)
    labelRoomSummary!: Label;
    @property(Node)
    labelNoRoom!: Node;

    @property(Prefab)
    prefabRoomListItem!: Prefab;

    onLoad() {
        smc.room = ecs.getEntity<Room>(Room);
        this.on(RoomEvent.RoomEnter, this.onHandler, this);
    }

    start() {
        this.labelRoomSummary.string = '';
        this.labelNoRoom.active = false;
        this.inputNickname.string = RANDOM_NAMES[RANDOM_NAMES.length * Math.random() | 0];

        // 轮询刷新房间列表
        this.schedule(() => {
            this.reloadRoomList();
        }, 1);
        this.reloadRoomList();
    }

    /** 刷新房间列表 */
    async reloadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                this.labelNoRoom.active = ret.res.rooms.length === 0;
                this.labelRoomSummary.string = `${ret.res.rooms.sum(v => v.playerNum)} 人在线`;

                this.roomList.content!.removeAllChildren();

                for (let roomInfo of ret.res.rooms) {
                    let node = instantiate(this.prefabRoomListItem);
                    this.roomList.content!.addChild(node);
                    node.getComponent(RoomListItem)!.options = {
                        room: roomInfo,
                        onClick: v => {
                            if (!this.inputNickname.string) {
                                return oops.gui.toast('先给自己取个名字吧!');
                            }

                            smc.room.RoomModel.roomId = v.roomId;
                            smc.room.RoomModel.serverUrl = v.serverUrl;
                            smc.room.RoomModel.playerName = this.inputNickname.string;
                            this.enter();
                        }
                    };
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }

    private onHandler(event: string, data: any) {
        switch (event) {
            case RoomEvent.RoomEnter:
                this.enter();
                break;
        }
    }

    private async enter() {
        var node = await oops.gui.openAsync(UIID.Loading);
        if (node) smc.initialize.add(node.getComponent(LoadingViewComp) as ecs.Comp);
        oops.gui.remove(UIID.Demo_Match);
    }

    async onBtnCreateRoom() {
        if (!this.inputNickname.string) {
            return oops.gui.toast('先给自己取个名字吧!');
        }

        smc.room.create("自定义房间", this.inputNickname.string);
    }

    async onBtnMatch() {
        if (!this.inputNickname.string) {
            return oops.gui.toast('先给自己取个名字吧!');
        }

        smc.room.matchStart(this.inputNickname.string);
    }
}