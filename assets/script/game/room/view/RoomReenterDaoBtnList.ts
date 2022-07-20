import { Component, Node, EditBox, Label, _decorator, Vec3 } from 'cc';
import { timeStamp } from 'console';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { LoadingViewComp } from '../../initialize/view/LoadingViewComp';
import { Room } from '../Room';
import { RoomEnterDaoBtnList } from './RoomEnterDaoBtnList';
// import { smc } from '../../common/ecs/SingletonModuleComp';
const { ccclass, property } = _decorator;

export type RoomReenterDaoBtnListOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomName: string,
        roomId: string,
        playerName: string
    }) => void
};

@ccclass('RoomReenterDaoBtnList')
export class RoomReenterDaoBtnList extends Component {

    @property(Node)
    roomName: Node = null;

    private _options!: RoomReenterDaoBtnListOptions;
    public get options(): RoomReenterDaoBtnListOptions {
        return this._options!;
    }
    public set options(v: RoomReenterDaoBtnListOptions) {
        this._options = v;
    }

    private roomInfo;

    initRoomInfo(roomInfo) {
        this.roomName.getComponent(Label).string = roomInfo.name;
        this.roomInfo = roomInfo;
    }

    onBtnSwitch() {
        smc.room.RoomModel.roomId = this.roomInfo.roomId;
        smc.room.RoomModel.serverUrl = this.roomInfo.serverUrl;
        smc.room.RoomModel.playerName = localStorage.getItem('username');

        smc.room.leave();
        
        console.log(this.roomInfo);
        // this._options.onClick({
        //     serverUrl: this.roomInfo.serverUrl,
        //     roomName: this.roomInfo.name,
        //     roomId: this.roomInfo.roomId,
        //     playerName: localStorage.getItem('username')
        // })
    }
}
