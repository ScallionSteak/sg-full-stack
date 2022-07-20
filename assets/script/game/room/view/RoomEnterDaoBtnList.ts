import { Component, Node, EditBox, Label, _decorator, Vec3 } from 'cc';
import { timeStamp } from 'console';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
import { smc } from '../../common/ecs/SingletonModuleComp';
const { ccclass, property } = _decorator;

export type RoomEnterDaoBtnListOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomName: string,
        roomId: string,
        playerName: string
    }) => void
};

@ccclass('RoomEnterDaoBtnList')
export class RoomEnterDaoBtnList extends Component {

    @property(Node)
    roomName: Node = null;

    private _options!: RoomEnterDaoBtnListOptions;
    public get options(): RoomEnterDaoBtnListOptions {
        return this._options!;
    }
    public set options(v: RoomEnterDaoBtnListOptions) {
        this._options = v;
    }

    initRoomName(roomName: string) {
        this.roomName.getComponent(Label).string = 'Enter ' + roomName;
    }

    initRoomInfo(roomInfo) {
        this.roomName.getComponent(Label).string = roomInfo.name;
    }

    onBtnJoin() {
        this._options.onClick({
            serverUrl: this._options.room.serverUrl,
            roomName: this._options.room.name,
            roomId: this._options.room.roomId,
            playerName: localStorage.getItem('username')
        })
    }
}
