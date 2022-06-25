import { ConnectionStatus } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../../module/config/Config";
import { ServerMatch } from "../ServerMatch";
import { MatchUtil } from "./MatchUtil";

/** 开始匹配 */
@ecs.register('MatchStart')
export class MatchStartComp extends ecs.Comp {
    reset(): void { }
}

/** 下一个房间服务器编号 */
var NextRoomIndex: number = 1;
export class MatchStartSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MatchStartComp);
    }

    entityEnter(e: ServerMatch) {
        this.startMatch(e);
    }

    /** 开始匹配 */
    private async startMatch(e: ServerMatch) {
        await this.doMatch(e).catch(error => {
            e.MatchModel.hs.logger.error('[匹配错误]', error);
        });

        setTimeout(() => { this.startMatch(e) }, Config.match.match_interval_start);
    }

    /** 执行一次匹配 */
    private async doMatch(e: ServerMatch) {
        var server = e.MatchModel.hs;
        var rooms = e.MatchModel.rooms;
        var queue = e.MatchModel.queue;

        server.logger.log(`匹配开始，匹配人数     = ${queue.size}`);
        let succNum = 0;                                            // 成功匹配人数

        // 优先匹配更早开始匹配的房间
        let matchingRooms = rooms
            .map(v => {                                             // map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
                let rooms = v.state?.rooms ?? [];
                return rooms.map(v1 => ({
                    ...v1,
                    serverUrl: v.url
                }));
            })
            .flat()                                                 // flat() 数组扁平化
            .orderBy(v => v.timeStartMatch)                         // 优先匹配更早开始匹配的房间
            .map(v => ({
                id: v.id,
                serverUrl: v.serverUrl,
                playerNum: v.playerNum
            }));

        for (let call of queue) {
            // 连接已断开，不再匹配
            if (call.conn.status !== ConnectionStatus.Opened) {
                queue.delete(call);
                return;
            }

            // 在此实现自己的匹配规则  


            // 优先匹配人多的房间
            let room = matchingRooms.filter(v => v.playerNum < Config.room.max_user_num).orderByDesc(v => v.playerNum)[0];
            // 匹配成功
            if (room) {
                // 删除匹配队列信息
                queue.delete(call);

                // 房间人增加
                ++room.playerNum;
                if (room.playerNum >= Config.room.max_user_num) {
                    matchingRooms.removeOne(v => v === room);
                }

                // 返回结果给客户端
                call.succ({
                    serverUrl: room.serverUrl,
                    roomId: room.id
                });

                // 成功匹配人数
                ++succNum;
            }
            // 没有合适的房间，那么创建一个房间
            else {
                let retCreateRoom = await MatchUtil.createRoom('系统房间' + (NextRoomIndex++));
                if (retCreateRoom.isSucc) {
                    matchingRooms.push({
                        id: retCreateRoom.res.roomId,
                        serverUrl: retCreateRoom.res.serverUrl,
                        playerNum: 1
                    })

                    // 删除匹配队列信息
                    queue.delete(call);

                    call.succ({
                        roomId: retCreateRoom.res.roomId,
                        serverUrl: retCreateRoom.res.serverUrl,
                    })
                }
            }
        }

        server.logger.log(`匹配结束，成功匹配人数 = ${succNum}`)
    }
}