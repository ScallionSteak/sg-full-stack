import { Component, Node, EditBox, Label, _decorator, Vec3, SpriteAtlas, Sprite, assetManager, JsonAsset, resources } from 'cc';
import { timeStamp } from 'console';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { ResRoomList } from '../../../tsrpc/protocols/match/PtlRoomList';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { LoadingViewComp } from '../../initialize/view/LoadingViewComp';
import { Room } from '../Room';
import { RoomEnterDaoBtnList } from './RoomEnterDaoBtnList';
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
    roomLogo: Node = null;

    @property(SpriteAtlas)
    UIAtlas: SpriteAtlas = null;

    private _options!: RoomReenterDaoBtnListOptions;
    public get options(): RoomReenterDaoBtnListOptions {
        return this._options!;
    }
    public set options(v: RoomReenterDaoBtnListOptions) {
        this._options = v;
    }

    private roomInfo;
    private seeDaoGuildGuideData: any;    

    loadJson() {
        var fileName = 'config/game/seeDaoGuildGuideData';
        resources.load(fileName, (err, json: JsonAsset) => {
            if (err) {
                console.log(fileName, err);
            }
            this.seeDaoGuildGuideData = json;
        });
    }

    initRoomInfo(roomInfo) {
        switch (roomInfo.name) {
            case 'PublicSpaceRoom':
                this.roomLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/sgLogo');
                break;
            case 'SeeDAORoom':
                this.roomLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/seedaoLogo');
                this.loadJson();
                break;
            case 'HYDAORoom':
                this.roomLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/hydaoLogo');
                break;
            case 'AMDAORoom':
                this.roomLogo.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/amdaoLogo');
                break;
            default:
                console.log('room names dont match. some wrong here')
                break;
        }
        this.roomInfo = roomInfo;
    }

    onBtnSwitch() {
        /** 如果是从引导点进来的，要关闭引导的窗口 */
        if (oops.gui.has(UIID.Demo_npcDialog)) {
            oops.gui.remove(UIID.Demo_npcDialog);
        }
        smc.room.RoomModel.roomId = this.roomInfo.roomId;
        smc.room.RoomModel.serverUrl = this.roomInfo.serverUrl;
        smc.room.RoomModel.playerName = localStorage.getItem('username');
        smc.room.RoomModel.roomName = this.roomInfo.name;
        if (this.roomInfo.name == 'SeeDAORoom') {
            //把seedao公会引导数据加载进来
            smc.room.RoomModel.roomGuildGuideData = this.seeDaoGuildGuideData;
        }
        smc.room.leave();
    }
}
