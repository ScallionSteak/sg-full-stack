import { ApiCallHttp } from "tsrpc";
import { sm } from "../../../ServerMatch";
import { ReqMatchStart, ResMatchStart } from "../../../tsrpc/protocols/match/PtlMatchStart";

/** 加入匹配队列，待匹配 */
export async function ApiMatchStart(call: ApiCallHttp<ReqMatchStart, ResMatchStart>) {
    sm.MatchModel.queue.add(call);
}