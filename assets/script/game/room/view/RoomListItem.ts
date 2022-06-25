/*
 * @Author: dgflash
 * @Date: 2022-05-11 18:21:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 16:24:14
 */

import { Component, Label, _decorator } from 'cc';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
const { ccclass, property } = _decorator;

export type RoomListItemOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomId: string
    }) => void
};

@ccclass('RoomListItem')
export class RoomListItem extends Component {
    @property(Label)
    labelName!: Label;
    @property(Label)
    labelInfo!: Label;

    private _options!: RoomListItemOptions;
    public get options(): RoomListItemOptions {
        return this._options!;
    }
    public set options(v: RoomListItemOptions) {
        this._options = v;

        this.labelName.string = v.room.name;
        this.labelInfo.string = `人数:${v.room.playerNum}/${v.room.playerMax} 服务器:${v.room.serverUrl}`;
    }

    onBtnJoin() {
        this._options.onClick({
            serverUrl: this._options.room.serverUrl,
            roomId: this._options.room.roomId
        })
    }

}
