import { Component, EventKeyboard, input, Input, KeyCode, v3, Vec3, _decorator } from 'cc';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { Role } from '../Role';
import { RoleViewComp } from './RoleViewComp';
const { ccclass, property } = _decorator;

/** 键盘控制移动 */
@ccclass('RoleKeyboard')
export class RoleKeyboard extends Component {
    /** 角色对象 */
    private role: Role;
    /** 控制移动方向 */
    private data: any = {};

    start() {
        this.role = this.getComponent(RoleViewComp).ent as Role;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.data.vector = new Vec3();
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.data.vector.x = -1;
                this.role.RoleView.moveJoystick(this.data);
                smc.room.playerMove(this.data.vector, 0);
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.data.vector.x = 1;
                this.role.RoleView.moveJoystick(this.data);
                smc.room.playerMove(this.data.vector, 0);
                break;
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.data.vector.y = 1;
                this.role.RoleView.moveJoystick(this.data);
                smc.room.playerMove(this.data.vector, 0);
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.data.vector.y = -1;
                this.role.RoleView.moveJoystick(this.data);
                smc.room.playerMove(this.data.vector, 0);
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.data.vector.x = 0;
                this.role.RoleView.stop();
                smc.room.playerMove();
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.data.vector.x = 0;
                this.role.RoleView.stop();
                smc.room.playerMove();
                break;
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.data.vector.y = 0;
                this.role.RoleView.stop();
                smc.room.playerMove();
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.data.vector.y = 0;
                this.role.RoleView.stop();
                smc.room.playerMove();
                break;
        }
    }

    /** 后续修改点：移动边界验证与移动体验代码 */
    move() {
        var tile = smc.scene.MapModel.getPosToTile(this.node.position.clone());
        // 边界
        if (tile == null) {
            this.node.setPosition(this.role.RoleModel.tile.px, this.role.RoleModel.tile.py);
            return
        }

        // 不在同一网格
        if (tile != this.role.RoleModel.tile) {
            this.role.RoleModel.tile = tile;
            this.role.RoleView.move(v3(tile.px, tile.py));
        }
    }

    // update(dt: number) {
    //     if (this.vector.x != 0 || this.vector.y != 0) {
    //         Vec3.multiplyScalar(this.vector, this.vector, this.role.RoleModel.speed * dt);
    //         this.node.translate(this.vector, Node.NodeSpace.LOCAL);
    //     }
    // }
}