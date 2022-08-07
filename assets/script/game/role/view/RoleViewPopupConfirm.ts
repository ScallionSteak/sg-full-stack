/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, v3, Vec3, _decorator } from 'cc';
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
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
const { ccclass, property } = _decorator;

export type EnterSpecificDaoOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomName: string,
        roomId: string,
        playerName: string
    }) => void
};

/** 角色摇撼控制 */
@ccclass("RoleViewPopupConfirm")
@ecs.register('RoleViewPopupConfirm', false)
export class RoleViewPopupConfirm extends CCComp {

    @property({ type: Node })
    daoName: Node = null!;

    private _options!: EnterSpecificDaoOptions;
    public get options(): EnterSpecificDaoOptions {
        return this._options!;
    }
    public set options(v: EnterSpecificDaoOptions) {
        this._options = v;
    }
    private daoID;
    private roomInfo;
    private curRoomName = '';
    
    onLoad() {
        this.daoID = this.node.getComponent(DelegateComponent).viewParams.params;
        var name = '';
        switch (this.daoID) {
            case 19: //amdao
                name = 'AMDAO';
                this.curRoomName = 'AMDAORoom';

                break;
            case 20: //hydao
                name = 'HYDAO';
                this.curRoomName = 'HYDAORoom';

                break;
            case 21: //seedao
                name = 'SeeDAO';
                this.curRoomName = 'SeeDAORoom';

                break;
            default:
                break;
        }
        this.daoName.getComponent(Label).string = name;
        this.defineDaoRoom();
    }

    enterDao() {
        smc.room.RoomModel.roomId = this.roomInfo.roomId;
        smc.room.RoomModel.serverUrl = this.roomInfo.serverUrl;
        smc.room.RoomModel.playerName = localStorage.getItem('username');
        smc.room.RoomModel.roomName = this.roomInfo.name;
        this.closeSelf();
        smc.room.leave();
    }

    async defineDaoRoom() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                for (let roomInfo of ret.res.rooms) {
                    if (this.curRoomName == roomInfo.name) {
                        this.roomInfo = roomInfo;
                    }
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_popupConfirm);
    }

    reset(): void {

    }
}