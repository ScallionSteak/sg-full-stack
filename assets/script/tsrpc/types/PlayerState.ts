/*
 * @Author: dgflash
 * @Date: 2022-05-17 13:52:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-30 11:55:39
 */

/** 房间控制数据 */
export interface PlayerMove {
    /** 玩家编号 */
    uid: string;
    /** 触摸地图目标位置移动信息 */
    target?: PlayerPosition;
    /** 摇杆移动方向信息 */
    vector?: PlayerPosition;
    /** 角度 */
    angle?: number;
    /** 玩家动作 */
    action?: string;
}

/** 玩家位置信息 */
export interface PlayerPosition {
    /** X 轴位置 */
    x: number,
    /** Y 轴位置 */
    y: number,
    /** Z 轴位置 */
    z: number
}

/** 玩家旋转信息 */
export interface PlayerRotation {
    /** 四元数 X */
    x: number,
    /** 四元数 Y */
    y: number,
    /** 四元数 Z */
    z: number,
    /** 四元数 W */
    w: number
}