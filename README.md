## This is the codebase of DAOLink.

## Art work credits
- LimeZu (https://limezu.itch.io/).





## ==============以下为技术说明==============

产品前后端全采用TypeScript语言实现，同时业务代码使用同一套ECS框架设计，前后端代码风格接近，便于理解学习。

前端框架采用 [oops framework](https://store.cocos.com/app/detail/3558) 做为业务框架。

后端框架采用 [tsrpc](https://tsrpc.cn/) 框架，使用这套框架前后端通讯协议就不需要在学习其它中间协议语言，全自动工具生成协议代码，底层二进制传输数据，可把精力关注到游戏业务逻辑设计上，提高开发效率。（感谢 tsrpc 作者提供优秀的技术资源）

## 开发环境
- 引擎版本：Cocos Creator 3.5.1
- 编程语言：TypeScript

## 已适配平

| H5  | 微信小游戏 | Android原生 | iOS原生 | 抖音小游戏 | OPPO小游戏 | vivo小游戏 |
| --- | ---------- | ----------- | ------- | ---------- | ---------- | ---------- |
| ✔   | ✘          | ✔           | ✘       | ✘          | ✘          | ✘          |

本资源仅支持测试通过平台，其他平台理论上是支持的，有问题请自行适配。

本资源核心业务代码不依赖游戏引擎，需要用到2.x引擎的同学，可以把room模块拷贝到2.x中项目中使用。

## 功能介绍
- 玩法功能
    - 创建房间
    - 随机匹配加入一个房间
    - 获取当前在线房间列表，可加入个人数未满的房间
    - 玩家加入房间
    - 玩家退出房间
    - 摇杆控制角色移动同步
    - 触摸地图目标点控制移动同步
    - 弱网移动同步策略
    - 基础战斗同步逻辑
- 客户端功能模块
    - 游戏公共模块
    - 游戏初始化模块
    - 摄像机管理模块
        - 轨道摄影机
        - ＰＣ平台鼠标滚轮调整镜头距离
    - 地图管理模块
    - 房间管理模块
    - 角色管理模块
        - MOBA类攻击前摇后摇，实现走A效果，手机上遥感方便操作出来
        - 移动、攻击、死亡、复活
    - 技能系统模块
        - 弓箭类技能
- 服务端功能模块
    - 支持 HTTPS、WSS
    - 匹配服务器
        - 服务器初始化
        - 房间服务器加入并进入工作状态
        - 获取在线的游戏房间列表
        - 创建一个房间
            - 在人数所少房间服务器创建
        - 匹配一个房间，如果在超时前没匹配到则创建一个新房间进入
    - 房间服务器
        - 服务管理模块
            - 服务器初始化
            - 申请加入匹配服务器，等待授权进入工作状态
            - 登录权限验证
            - 断线逻辑
                - 玩家断线自动离开房间
                - 与匹配服务器断线，无限尝试连接匹配服务器直到恢复正常后继续提供服务
            - 空房回收策略
            - 聊天业务处理
            - 加入房间业务处理
            - 离开房间业务处理
        - 房间管理模块
            - 房间数据状态管理
            - 房间内玩家状态广播
        - 玩家管理模块
            - 玩家数据状态管理
            - 玩家玩法协议代码分离设计
            - 玩家移动状态同步
            - 玩家移动广播
            - 玩家攻击广播
            - 玩家离开房间广播

## 工程结构与第三方库下载
- 客户端
    - assets 资源与脚本目录
    - 使用 vscode 打开 cocos creator 3.5.1 项目
    - 使用 vscode 中的终端（Ctrl + `)，运行 npm install -d
    - 连接服务器配置文件 RoomConfig.ts，默认连接外网作者的服务器，本地调试可修改为本地ＩＰ
- 服务端
    - tsrpc_server 脚本目录
    - 使用 vscode 打开 tsrpc_server 目录
    - 使用 vscode 中的终端（Ctrl + `)，运行 npm install -d
    - 配置文件 Config.ts

## 调试与部署
- 调试环境
    - npm run dev:match 启动匹配服务器
    - npm run dev:room 启动房间服务器
    - npm run dev:room2 再启动一个房间服务器测试分布式
    - npm run build 构建发布
- 生产环境
    - npm install pm2@latest -g 安装工具
    - pm2 start ecosystem.config.js --env production 启动生成环境
    - pm2 start ecosystem.config.js --env develop 启动调试环境
    - pm2 delete all 停止所有服务器
- tsrpc教程[参考](https://tsrpc.cn/)
