/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 17:28:53
 */
import { PrefixLogger } from "tsrpc";
import { ecs } from "../../core/ecs/ECS";
import { RoomConnection } from "../../server/room/model/ServerRoomModelComp";
import { sr } from "../../ServerRoom";
import { ServiceType } from "../../tsrpc/protocols/ServiceProtoRoom";
import { PlayerInfo } from "../../tsrpc/types/PlayerInfo";
import { PlayerPosition, PlayerRotation } from "../../tsrpc/types/PlayerState";
import { RoomBroadcastPlayerStateComp, RoomBroadcastPlayerStateSystem } from "./bll/RoomBroadcastPlayerState";
import { RoomModelComp } from "./model/RoomModelComp";

/** 
 * 游戏房间 
 * 1、状态同步，实时广播玩家游戏中状态（例：位置信息）
 *    优点：
 *          1、服务器可以做逻辑验证
 *    缺点：
 *          1、数据包较大，网络传输较慢时
 *          2、如果与玩家自己的客户端做和解逻辑，容易出现位置信息作弊情况。
 *          3、如果不做和解逻辑，玩家不会被服务器数据拽回来感觉卡顿效果
 *          4、其它玩家做插值移动时，与客户端自己做平滑移动效果略差一点
 * 2、帧同步：
 *    优点：
 *          1、只传输玩家操作状态，数据包小
 *          2、网络正常情况下、玩家移动动画体验较好，所有玩家移动逻辑都是客户端计算
 *    缺点：
 *          1、断线重连接时，需要补帧同步玩家状态
 *          2、客户端随机都是伪随即保持多端计算结果同步
 *          3、网络卡时，玩家玩法控制角色，会朝向一个方向移动（可选策略）
 */
export class Room extends ecs.Entity {
    RoomModel!: RoomModelComp;

    get logger(): PrefixLogger {
        return this.RoomModel.logger;
    }

    protected init() {
        this.addComponents<ecs.Comp>(
            RoomModelComp,
            RoomBroadcastPlayerStateComp
        );
    }

    destroy(): void {
        this.remove(RoomBroadcastPlayerStateComp);
        super.destroy();
    }

    /** 添加房间中玩家 */
    addPlayer(conn: RoomConnection, player: (PlayerInfo & { pos: PlayerPosition } & { rotation: PlayerRotation })) {
        let rm = this.RoomModel;

        // 同步房间所有角色状态数据
        rm.data.players.forEach(v => {
            var player = rm.states[v.id];
            v.pos = player.pos;
            v.rotation = player.rotation;
        });

        // 新玩数据连接加入连接列表
        rm.conns.push(conn);

        // 新玩数据加入房间列表中
        rm.data.players.push(player);

        // 新玩家状态数据添加
        rm.states[player.id] = { uid: player.id, pos: player.pos, rotation: player.rotation, action: 'idle' }

        // 房间空房时间
        rm.data.timeLastEmpty = undefined;

        // 房间更新时间
        rm.data.timeUpdate = Date.now();
    }

    /** 移除房间中玩家 */
    removePlayer(conn: RoomConnection) {
        let uid = conn.player.PlayerModel.pi.id;
        delete this.RoomModel.states[uid];                           // 从房间中移除玩家状态数据
        this.RoomModel.conns.removeOne(v => v === conn);                   // 从房间中移除离开的连接对象
        this.RoomModel.data.players.removeOne(v => v.id === uid);          // 从房间玩家列表中移除离开的玩家
        this.RoomModel.data.timeUpdate = Date.now();                       // 记录房间更新时间
    }

    /** 房间内消息广播 */
    broadcastMsg<T extends keyof ServiceType['msg']>(msgName: T, msg: ServiceType['msg'][T]) {
        sr.ServerRoomModel.wsSrever.broadcastMsg(msgName, msg, this.RoomModel.conns);
    }
}

export class EcsRoomSystem extends ecs.System {
    constructor() {
        super();

        this.add(new RoomBroadcastPlayerStateSystem());
    }
}