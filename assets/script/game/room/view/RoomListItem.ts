/*
 * @Author: dgflash
 * @Date: 2022-05-11 18:21:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 16:24:14
 */

import { Component, Node, EditBox, Label, _decorator, Vec3 } from 'cc';
import { timeStamp } from 'console';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
const { ccclass, property } = _decorator;

export type RoomListItemOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomId: string,
        playerName: string
    }) => void
};

@ccclass('RoomListItem')
export class RoomListItem extends Component {

    @property(Node)
    userName: Node = null;

    @property(Node)
    createRoleLayer: Node = null;

    @property(Node)
    enterPbBtn: Node = null;

    private selectedUserModel: string = '1';
    public isNew: Boolean = true;

    private _options!: RoomListItemOptions;
    public get options(): RoomListItemOptions {
        return this._options!;
    }
    public set options(v: RoomListItemOptions) {
        this._options = v;
    }

    updateUserModel(event: any, customEventData: string) {
        this.selectedUserModel = customEventData;
    }

    saveUserInfo() {
        var jsonfile = { username: this.userName.getComponent(EditBox).string, walletAddress: localStorage.getItem('walletAddress'), userModel: this.selectedUserModel };
        console.log('jsonfile is ---------', jsonfile);
        oops.http.postJSON('/insertUserConfig', jsonfile, (res) => {
            console.log('test res', res);
        });
    }

    manageUIByUserType() {
        if (this.isNew) {
            this.createRoleLayer.active = true;
        } else {
            this.createRoleLayer.active = false;
            this.enterPbBtn.setPosition(0,0,0);
        }
    }

    onBtnJoin() {
        this._options.onClick({
            serverUrl: this._options.room.serverUrl,
            roomId: this._options.room.roomId,
            playerName: this.userName.getComponent(EditBox).string
        })
        if (this.isNew) {
            this.saveUserInfo();
        }
    }

}
