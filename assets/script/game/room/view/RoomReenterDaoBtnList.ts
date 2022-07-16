import { Component, Node, EditBox, Label, _decorator, Vec3 } from 'cc';
import { timeStamp } from 'console';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { Room } from '../Room';
// import { smc } from '../../common/ecs/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('RoomReenterDaoBtnList')
export class RoomReenterDaoBtnList extends Component {

    @property(Node)
    roomName: Node = null;

    private roomIdString = '';
    private serverUrlString = '';
    private roomNameString = '';

    initRoomInfo(roomInfo) {
        this.roomIdString = roomInfo.roomId;
        this.serverUrlString = roomInfo.serverUrl;
        this.roomNameString = roomInfo.name;
        this.roomName.getComponent(Label).string = roomInfo.name;
    }

    onBtnJoin() {
        smc.room.RoomModel.roomId = this.roomIdString;
        smc.room.RoomModel.serverUrl = this.serverUrlString;
        smc.room.RoomModel.roomName = this.roomNameString;
        smc.room.leave();
    }
}
