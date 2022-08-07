import { Component, _decorator, Node, Animation, Prefab, SpriteAtlas, Sprite } from "cc";
import { HttpRequestForDS } from "../../../../../extensions/oops-framework/assets/core/network/http";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { RoleViewPlayerState } from "../../room/bll/RoleViewPlayerState";
import { RoleModelComp } from "../model/RoleModelComp";
import { RoleViewComp } from "./RoleViewComp";

const { ccclass, property } = _decorator;

/** 角色动画 */
@ccclass('RoleViewAnimator')
export class RoleViewAnimator extends Component {

    @property(Node)
    player: Node = null;

    @property(SpriteAtlas)
    playerAtlas: SpriteAtlas = null;

    private roleModelID: string = '1'; //默认第一个模型

    start() {
        smc.room.RoomModel.players.forEach(d => {
            if (d.RoleModel.id == smc.room.RoomModel.owner.RoleModel.id) {
                this.roleModelID = localStorage.getItem('roleModelID');
            } else if (d.RoleModel.id == this.node.getComponent(RoleViewComp).ent.get(RoleModelComp).id) {
                let jsonfile = { username: d.RoleModel.nickname };
                var _http = new HttpRequestForDS();
                var url = '/queryUserconfigByUsername';
                _http.postJSON(url, jsonfile, (res) => {
                    var jsonres = JSON.parse(res);
                    this.roleModelID = jsonres[0].userModel; 
                });    
                
            }
        })        
    }

    /** 待机动画 */
    idle() {
        this.player.getComponent(Animation).stop();
    }

    // 
    /** 四方向移动动画 */
    run(data: any) {
        if (data.vector.x == -1) {
            var animaName = 'role0' + this.roleModelID + 'Left';
        } else if (data.vector.x == 1) {
            var animaName = 'role0' + this.roleModelID + 'Right';
        }
        if (data.vector.y == -1) {
            var animaName = 'role0' + this.roleModelID + 'Down';
        } else if (data.vector.y == 1) {
            var animaName = 'role0' + this.roleModelID + 'Up';
        }
        var animaComponent = this.player.getComponent(Animation);
        var animaState = animaComponent.getState(animaName);
        if (!animaState.isPlaying) {
            this.player.getComponent(Animation).play(animaName);
        }
    }
}