import chalk from "chalk";
import { ApiCall, PrefixLogger, TsrpcError, WsClient } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../../module/config/Config";
import { ReqRoomServerJoin, ResRoomServerJoin } from "../../../tsrpc/protocols/match/admin/PtlRoomServerJoin";
import { serviceProto as ServiceProtoRoom, ServiceType as ServiceTypeRoom } from "../../../tsrpc/protocols/ServiceProtoRoom";
import { IRoomServer } from "../model/MatchModelComp";
import { ServerMatch } from "../ServerMatch";

/** 匹配服务器添加进入工作状态的房间服务器 */
@ecs.register('MatchServerJoinRoom')
export class MatchServerJoinRoomComp extends ecs.Comp {
    calls: ApiCall<ReqRoomServerJoin, ResRoomServerJoin>[] = [];

    reset(): void {
        this.calls.splice(0, this.calls.length);
    }
}

export class MatchServerJoinRoomSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MatchServerJoinRoomComp);
    }

    async entityEnter(e: ServerMatch) {
        let server = e.MatchModel.hs;
        let rooms = e.MatchModel.rooms;
        let calls = e.MatchServerJoinRoom.calls;

        calls.forEach(async call => {
            // 鉴权
            if (call.req.adminToken !== Config.adminToken) return call.error('非法操作');

            let serverUrl = call.req.serverUrl;

            // 已经注册过
            if (rooms.some(v => v.url === serverUrl)) return;

            // 创建与房间服务器的 WebSocket 对象
            let wscRoom = new WsClient(ServiceProtoRoom, {
                server: serverUrl,
                logger: new PrefixLogger({
                    logger: server.logger,
                    prefixs: [chalk.green(`房间服务器 ${serverUrl}`)]
                }),
                heartbeat: {
                    interval: Config.match.room_heartbeat_interval,
                    timeout: Config.match.room_heartbeat_timeout
                },
                logMsg: Config.room.logMsg
            });

            // 添加房间服务器
            let irs: IRoomServer = {
                url: serverUrl,
                client: wscRoom
            }
            rooms.push(irs);

            // 自定义管线处理
            this.flows(e, wscRoom);

            // 自定义消息处理
            this.msgs(wscRoom, irs);

            try {
                // 连接房间服务器网络
                let op = await wscRoom.connect();
                if (!op.isSucc) {
                    throw new TsrpcError(op.errMsg);
                }

                // 通知房间服务器授权成功
                let opAuth = await wscRoom.callApi('admin/Auth', {
                    adminToken: Config.adminToken,
                    type: 'MatchServer'
                });

                // 授权失败立即断开
                if (!opAuth.isSucc) {
                    wscRoom.disconnect();
                    throw opAuth.err;
                }
            }
            catch (e: unknown) {
                // 房间服务器列表中删除
                rooms.remove(v => v.url === serverUrl);
                throw e;
            }

            server.logger.log(chalk.green(`房间服务器 ${serverUrl} 已加入, 当前房间服务器数量 = ${rooms.length}`));

            call.succ({});
        });

        e.remove(MatchServerJoinRoomComp);
    }

    /** 自定义管线 */
    private flows(e: ServerMatch, wscRoom: WsClient<ServiceTypeRoom>) {
        // 管线：客户端断开连接后 - 房间服务器列表中移除断开的房间服务器
        wscRoom.flows.postDisconnectFlow.push(v => {
            // 客户端断开时，更新对应房间状态
            e.MatchModel.rooms.remove(irs => {
                if (irs.client === wscRoom) {
                    if (v.isManual) {
                        e.MatchModel.hs.logger.log(chalk.red(`房间服务器 ${irs.url} 主动断开`));
                    }
                    else {
                        e.MatchModel.hs.logger.log(chalk.red(`房间服务器 ${irs.url} 异常断开`));
                    }
                    return true;
                }
                return false;
            });
            return v;
        });
    }

    /** 监听房间服务器消息 */
    private msgs(wscRoom: WsClient<ServiceTypeRoom>, irs: IRoomServer) {
        // 监听消息：更新房间状态
        wscRoom.listenMsg(`admin/RoomUpdateState`, msg => {
            irs.state = msg;
        });
    }
}