/*
 * @Author: dgflash
 * @Date: 2022-05-06 14:59:29
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-24 13:31:21
 */
import { ApiCall } from "tsrpc";
import { ecs } from "../../core/ecs/ECS";
import { CommonAdminTokenComp, CommonAdminTokenSystem } from "../../module/common/bll/CommonAdminToken";
import { ReqRoomServerJoin, ResRoomServerJoin } from "../../tsrpc/protocols/match/admin/PtlRoomServerJoin";
import { MatchServerJoinRoomComp, MatchServerJoinRoomSystem } from "./bll/MatchServerJoinRoom";
import { MatchServerStartComp, MatchServerStartSystem } from "./bll/MatchServerStart";
import { MatchStartComp, MatchStartSystem } from "./bll/MatchStart";
import { MatchModelComp } from "./model/MatchModelComp";

/** 匹配服务器 */
export class ServerMatch extends ecs.Entity {
    MatchModel!: MatchModelComp;

    CommonAdminToke!: CommonAdminTokenComp;
    MatchServerStart!: MatchServerStartComp;
    MatchStart!: MatchStartComp;
    MatchServerJoinRoom!: MatchServerJoinRoomComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            MatchModelComp);
    }

    /** 开启匹配服务器 */
    start() {
        this.add(MatchServerStartComp);
    }

    /** 加入房间服务器进入工作状态 */
    joinRoomServer(call: ApiCall<ReqRoomServerJoin, ResRoomServerJoin>) {
        var comp = this.get(MatchServerJoinRoomComp) || this.add(MatchServerJoinRoomComp);
        comp.calls.push(call);
    }
}

export class EcsMatchSystem extends ecs.System {
    constructor() {
        super();

        this.add(new CommonAdminTokenSystem());
        this.add(new MatchServerStartSystem());
        this.add(new MatchStartSystem());
        this.add(new MatchServerJoinRoomSystem());
    }
}