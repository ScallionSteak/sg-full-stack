import { _decorator, Node, Label, EditBox } from "cc";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { ResRoomList } from "../../../tsrpc/protocols/match/PtlRoomList";
import { CCComp } from "../../common/ecs/view/CCComp";

const { ccclass, property } = _decorator;

export type RoomListItemOptions = {
    room: ResRoomList['rooms'][number],

    onClick: (v: {
        serverUrl: string,
        roomId: string
    }) => void
};

/** 视图层对象 */
@ccclass('createRoleComp')
@ecs.register('createRole', false)
export class createRoleComp extends CCComp {

    @property(Node)
    userName: Node = null;

    @property(Node)
    userModelParent: Node = null;

    private selectedUserModel: string = '1';
    private _options!: RoomListItemOptions;

    /** 视图层逻辑代码分离演示 */
    onLoad() {
        // var entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
        // this.on(ModuleEvent.Cmd, this.onHandler, this);
    }

    updateUserModel(event: any, customEventData: string) {
        this.selectedUserModel = customEventData;
    }

    saveUserInfo() {
        var jsonfile = { username: this.userName.getComponent(EditBox).string, walletAddress: oops.storage.get('walletAddress'), userModel: this.selectedUserModel };
        oops.http.postJSON('/insertUserConfig', jsonfile, (res) => {
            console.log('test res', res);
        });
    }    

    enterPublicSpace() {
        this._options.onClick({
            serverUrl: this._options.room.serverUrl,
            roomId: this._options.room.roomId
        })
    }

    /** 全局消息逻辑处理 */
    // private onHandler(event: string, args: any) {
    //     switch (event) {
    //         case ModuleEvent.Cmd:
    //             break;
    //     }
    // }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}