/*
 * @Author: dgflash
 * @Date: 2022-05-27 11:31:21
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-27 16:15:32
 */

/** 服务器接受与广播攻击行为 */
export interface MsgPlayerAttack {
    /** 玩家编号 */
    uid: string,
    /** 目标玩家编号 */
    targetId: string,
    /** 技能标号 */
    skillId: number
}