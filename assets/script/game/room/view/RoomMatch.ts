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

const { ccclass, property } = _decorator;

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
    @property(Prefab)
    prefabEnterDaoBtnListItem!: Prefab;

    onLoad() {
        smc.room = ecs.getEntity<Room>(Room);
        this.on(RoomEvent.RoomEnter, this.onHandler, this);
    }

    start() {
        this.loadRoomList();
    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                var walletAddress = { walletAddress: localStorage.getItem('walletAddress') };
                console.log('walletaddress is ---------', walletAddress);
                var _http = new HttpRequestForDS();
                var url = '/queryUserConfigByWalletAddress';
                _http.postJSON(url, walletAddress, (res) => {
                    let node = instantiate(this.prefabRoomListItem);
                    this.node.addChild(node);
                    if (res == '0') {
                        /**
                         * 新用户，这个0是在服务端的参数，万一要修改，需要客户端服务端互相告知
                         * 新用户那就只处理公区房间就好了
                         */
                        for(let i = 0; i< ret.res.rooms.length; i++) {
                            if(ret.res.rooms[i].name == 'PublicSpaceRoom'){
                                var pbRoomInfo = ret.res.rooms[i];
                                break;
                            }
                        }
                        node.getComponent(RoomListItem)!.isNew = true;
                        node.getComponent(RoomListItem)!.options = {
                            room: pbRoomInfo,
                            onClick: v => {
                                smc.room.RoomModel.roomId = v.roomId;
                                smc.room.RoomModel.serverUrl = v.serverUrl;
                                smc.room.RoomModel.playerName = v.playerName;
                                smc.room.RoomModel.roomName = v.roomName;
                                this.enter();
                            }
                        };
                    } else {
                        //老用户，用户信息存到本地，因为会到处用
                        node.getComponent(RoomListItem)!.isNew = false;
                        var resAsJson = JSON.parse(res);
                        localStorage.setItem('username', resAsJson[0].username);
                        localStorage.setItem('roleModelID', resAsJson[0].userModel);
                        //创建各个DAO房间信息
                        for (let roomInfo of ret.res.rooms) {
                            if (roomInfo.name != 'PublicSpaceRoom') {
                                //DAO私域创建
                                let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                                btnNode.getComponent(RoomEnterDaoBtnList).initRoomName(roomInfo.name);
                                btnNode.parent = node.getChildByName('daoBtnLayer');
                                btnNode.getComponent(RoomEnterDaoBtnList)!.options = {
                                    room: roomInfo,
                                    onClick: v => {
                                        smc.room.RoomModel.roomId = v.roomId;
                                        smc.room.RoomModel.serverUrl = v.serverUrl;
                                        smc.room.RoomModel.playerName = resAsJson[0].username;
                                        smc.room.RoomModel.roomName = v.roomName;
                                        this.enter();
                                    }
                                };
                            } else {
                                //公区
                                node.getComponent(RoomListItem)!.options = {
                                    room: roomInfo,
                                    onClick: v => {
                                        smc.room.RoomModel.roomId = v.roomId;
                                        smc.room.RoomModel.serverUrl = v.serverUrl;
                                        smc.room.RoomModel.playerName = v.playerName;
                                        smc.room.RoomModel.roomName = v.roomName;
                                        this.enter();
                                    }
                                };
                            }
                        }
                    }
                    node.getComponent(RoomListItem)!.manageUIByUserType();
                });
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
}