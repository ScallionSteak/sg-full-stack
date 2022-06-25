/*
 * @Author: dgflash
 * @Date: 2022-05-06 14:59:29
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:31:35
 */
import { ApiCallHttp, HttpServer, WsClient } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { ReqMatchStart, ResMatchStart } from "../../../tsrpc/protocols/match/PtlMatchStart";
import { MsgRoomUpdateState } from "../../../tsrpc/protocols/room/admin/MsgRoomUpdateState";
import { ServiceType as ServiceTypeRoom } from "../../../tsrpc/protocols/ServiceProtoRoom";

/**
 * 匹配服务器与房间服务器之间的逻辑
 * 1、添加房间服务器时，通知匹配服务器。匹配服务器记录房间服务器数据
 * 2、房间服务器状态变化时，同步到匹配服务器（房间数量变化、房间细节信息变化时同步）
 */

/** 房间服务器数据 */
export interface IRoomServer {
    /** 房间服务器连接地址 */
    url: string,
    /** 房间服务器连接对象 */
    client: WsClient<ServiceTypeRoom>,
    /** 房间状态数据 */
    state?: MsgRoomUpdateState
}

/** 匹配数据 */
@ecs.register('MatchModel')
export class MatchModelComp extends ecs.Comp {
    /** 服务管理器 */
    hs: HttpServer = null!

    /** 已注册的房间服务器 */
    readonly rooms: IRoomServer[] = [];

    /** 待匹配队列 */
    readonly queue = new Set<ApiCallHttp<ReqMatchStart, ResMatchStart>>();

    reset(): void {

    }
}