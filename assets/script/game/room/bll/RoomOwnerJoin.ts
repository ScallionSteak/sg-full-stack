/*
 * @Author: dgflash
 * @Date: 2022-05-13 10:12:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-06 14:04:14
 */

import { Node } from 'cc';
import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { ResRoomJoin } from '../../../tsrpc/protocols/room/PtlRoomJoin';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { RoleKeyboard } from '../../role/view/RoleKeyboard';
import { Scene } from '../../scene/Scene';
import { MapViewControl } from '../../scene/view/MapViewControl';
import { Room } from '../Room';
import { RoleViewPlayerState } from './RoleViewPlayerState';
import { RoomUtil } from './RoomUtil';
import { ChartRTCConnect } from '../../chart/bll/ChartRTCConnect';
import { ChartRTCInfo } from '../../chart/model/ChartRTCInfo';

/** 自己加入房间 - 初始化游戏世界数据 */
@ecs.register('RoomOwnerJoin')
export class RoomOwnerJoinComp extends ecs.Comp {
    data: ResRoomJoin = null;

    reset(): void {
        this.data = null!;
    }
}

export class RoomOwnerJoinSystem
    extends ecs.ComblockSystem
    implements ecs.IEntityEnterSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomOwnerJoinComp);
    }
    init(): void {
        console.log('---- RoomOwnerJoin - init');
    }
    async entityEnter(e: Room) {
        var data = e.get(RoomOwnerJoinComp).data;
        console.log('---- RoomOwnerJoin - entityEnter:\t', data);

        // 创建游戏地图管理对象
        smc.scene = ecs.getEntity<Scene>(Scene);

        // 记录房间名
        smc.scene.MapModel.name = data.room.name;

        // 连接房间语音  临时测试 nico
        let info: ChartRTCInfo = {
            appid: 'cabca1fd31434aa49665d5cbe6c4da88',
            channel: data.room.name,
            uid: data.playerInfo.id,
        };

        console.log('---- RoomOwnerJoin - connect:\t', info);
        ChartRTCConnect.connect(info);

        smc.scene.load('spaceMap', () => {
            // 绑定显示数据
            e.RoomModel.vm = {
                server: e.RoomModel.serverUrl,
                name: data.room.name,
                playerMax: data.room.playerMax,
                playerNum: data.room.players.length,
                ping: e.RoomModelNet.wsc.lastHeartbeatLatency,
            };
            e.RoomModel.vmAdd();

            // 添加其它玩家
            data.room.players.forEach((d) => {
                let player = RoomUtil.playerCreate(d);
                player.load(smc.scene.MapModel.game.node, (node: Node) => {
                    if (data.playerInfo.id == d.id) {
                        let owner = player;
                        smc.room.RoomModel.owner = owner;

                        smc.room.RoomModel.owner.RoleModel.userDBID = Number(
                            localStorage.getItem('userDBID')
                        );
                        smc.room.RoomModel.owner.RoleModel.userDBName =
                            localStorage.getItem('username');
                        smc.room.RoomModel.owner.RoleModel.userModelID = Number(
                            localStorage.getItem('roleModelID')
                        );

                        // 同步客户端状态组件
                        node.addComponent(RoleViewPlayerState);
                        // 角色控制器
                        node.addComponent(RoleKeyboard);

                        //加载房间UI
                        owner.loadSpaceUI();

                        // 设置跟随摄像机
                        var mvc =
                            smc.scene.MapView.node.getComponent(MapViewControl);
                        mvc.setMapByTarget(owner.RoleView.node.position);
                        mvc.target = owner.RoleView.node;
                    }

                    // 玩家使用网格坐标，记录到服务器
                    d.pos.z = 0;
                    RoomUtil.playerInited(player, d.pos, d.rotation);
                });
            });
            e.remove(RoomOwnerJoinComp);
        });
    }
}
