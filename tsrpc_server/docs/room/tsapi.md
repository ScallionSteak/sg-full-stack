
# TSRPC API 接口文档

## 通用说明

- 所有请求方法均为 `POST`
- 所有请求均需加入以下 Header :
    - `Content-Type: application/json`

## 目录

- admin
    - [Auth](#/admin/Auth)
    - [创建房间请求数据](#/admin/RoomCreate)
- [RoomChat](#/RoomChat)
- [RoomJoin](#/RoomJoin)
- [RoomLeave](#/RoomLeave)

---

## admin

### Auth <a id="/admin/Auth"></a>

**路径**
- POST `/admin/Auth`

**请求**
```ts
interface ReqAuth {
    adminToken: string,
    type: "MatchServer"
}
```

**响应**
```ts
interface ResAuth {

}
```

**配置**
```ts
{
  "allowGuest": true
}
```

---

### 创建房间请求数据 <a id="/admin/RoomCreate"></a>

**路径**
- POST `/admin/RoomCreate`

**请求**
```ts
interface ReqRoomCreate {
    /** 管理员授权码 */
    adminToken: string,
    /** 房间名 */
    roomName: string
}
```

**响应**
```ts
interface ResRoomCreate {
    /** 房间编号 */
    roomId: string
}
```

**配置**
```ts
{
  "allowGuest": true
}
```

---

## RoomChat <a id="/RoomChat"></a>

**路径**
- POST `/RoomChat`

**请求**
```ts
interface ReqRoomChat {
    content: string
}
```

**响应**
```ts
interface ResRoomChat {

}
```

---

## RoomJoin <a id="/RoomJoin"></a>

**路径**
- POST `/RoomJoin`

**请求**
```ts
interface ReqRoomJoin {
    nickname: string,
    roomId: string
}
```

**响应**
```ts
interface ResRoomJoin {
    /** 玩家信息 */
    playerInfo: {
        /** 玩家编号 */
        id: string,
        /** 玩家昵称 */
        nickname: string
    },
    /** 房间数据 */
    room: {
        /** 房间编号 */
        id: string,
        /** 房间名 */
        name: string,
        /** 房间可容纳的最大人数 */
        playerMax: /*uint*/ number,
        /** 房间内的用户 */
        players: ({
            /** 玩家编号 */
            id: string,
            /** 玩家昵称 */
            nickname: string
        } & {/** 玩家位置信息 */
            pos: {
                /** X 轴位置 */
                x: number,
                /** Y 轴位置 */
                y: number,
                /** Z 轴位置 */
                z: number
            }
        } & {/** 玩家旋转信息 */
            rotation: {
                /** 四元数 X */
                x: number,
                /** 四元数 Y */
                y: number,
                /** 四元数 Z */
                z: number,
                /** 四元数 W */
                w: number
            }
        })[],
        /** 上一次空房的时间（undefined 代表房内有人） 用于定时解散无人的房间 */
        timeLastEmpty?: number,
        /** 开始匹配的时间，`undefined` 代表不在匹配中 */
        timeStartMatch?: number,
        /** 房间信息的最后更新时间 */
        timeUpdate: number,
        /** 历史聊天信息（只保留最近的 N 条） */
        messages: {
            time: /*datetime*/ string,
            /** 玩家信息 */
            playerInfo: {
                /** 玩家编号 */
                id: string,
                /** 玩家昵称 */
                nickname: string
            },
            content: string
        }[]
    }
}
```

---

## RoomLeave <a id="/RoomLeave"></a>

**路径**
- POST `/RoomLeave`

**请求**
```ts
interface ReqRoomLeave {

}
```

**响应**
```ts
interface ResRoomLeave {

}
```

