/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 19:04:35
 */
import { macro, setDisplayStats, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { ecs } from '../../extensions/oops-framework/assets/libs/ecs/ECS';
import { config } from './game/common/config/Config';
import { CommonEnter } from './game/common/ecs/CommonEnter';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

macro.ENABLE_MULTI_TOUCH = false;

/** 一格移动，镜头跟随  */
@ccclass('Main')
export class Main extends CommonEnter {
    start() {
        if (DEBUG) setDisplayStats(true);
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);

        console.log(config.query.username);


    }
}