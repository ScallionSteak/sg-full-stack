/*
 * @Author: dgflash
 * @Date: 2022-05-11 10:38:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-20 23:20:18
 */
import { ecs } from '../../../core/ecs/ECS';
import { RoomConnection } from '../model/ServerRoomModelComp';
import { ServerRoom } from '../ServerRoom';
import { ServerRoomAuthComp } from './ServerRoomAuth';
import { ConnectionStatus } from 'tsrpc';

/**
 * 与匹配服务器断开后清理
 * 1、匹配服务器关闭后，会自动定时检查匹配服务器运行情况，正常后自动连接
 */
@ecs.register('ServerRoomDisconnect')
export class ServerRoomDisconnectComp extends ecs.Comp {
    reset(): void {}
}

export class ServerRoomDisconnectSystem
    extends ecs.ComblockSystem
    implements ecs.IEntityEnterSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomDisconnectComp);
    }

    async entityEnter(e: ServerRoom): Promise<void> {
        var srm = e.ServerRoomModel;

        // 管线：客户端断开连接后
        srm.wsSrever.flows.postDisconnectFlow.push(async (v) => {
            let conn = v.conn as RoomConnection;

            console.log(
                '-----------------ServerRoomDisconnectComp 连接断开啦-----------------'
            );
            // 玩家退出已加入的房间
            if (conn.room) {
                console.log(
                    '-----------------ServerRoomDisconnectComp 是房间-----------------'
                );
                await new Promise((rs) => {
                    setTimeout(rs, 4000);
                });
                if (v.conn.status === ConnectionStatus.Opened) {
                    console.log(
                        '-----------------ServerRoomDisconnectComp 重新连接成功-----------------'
                    );
                } else {
                    conn.player.leave();
                }
            }
            // 房间服务器与匹配服务器断开后自动触发重连
            else if (srm.matchServerConn === conn) {
                e.remove(ServerRoomAuthComp);
            }

            return v;
        });
    }
}
