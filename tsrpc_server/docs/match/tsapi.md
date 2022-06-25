
# TSRPC API 接口文档

## 通用说明

- 所有请求方法均为 `POST`
- 所有请求均需加入以下 Header :
    - `Content-Type: application/json`

## 目录

- admin
    - [RoomServerJoin](#/admin/RoomServerJoin)
- db
    - [AddPost](#/db/AddPost)
    - [DelPost](#/db/DelPost)
    - [GetPost](#/db/GetPost)
    - [UpdatePost](#/db/UpdatePost)
- [MatchStart](#/MatchStart)
- [RoomCreate](#/RoomCreate)
- [RoomList](#/RoomList)

---

## admin

### RoomServerJoin <a id="/admin/RoomServerJoin"></a>

**路径**
- POST `/admin/RoomServerJoin`

**请求**
```ts
interface ReqRoomServerJoin {
    /** RoomServer 的连接地址 */
    serverUrl: string,
    /** Token 用于鉴权 */
    adminToken: string
}
```

**响应**
```ts
interface ResRoomServerJoin {

}
```

---

## db

### AddPost <a id="/db/AddPost"></a>

**路径**
- POST `/db/AddPost`

**请求**
```ts
interface ReqAddPost {
    newPost: {
        /** 作者 */
        author: string,
        /** 标题 */
        title: string,
        /** 内容 */
        content: string
    }
}
```

**响应**
```ts
interface ResAddPost {
    insertedId: string
}
```

---

### DelPost <a id="/db/DelPost"></a>

**路径**
- POST `/db/DelPost`

**请求**
```ts
interface ReqDelPost {
    _id: string
}
```

**响应**
```ts
interface ResDelPost {

}
```

---

### GetPost <a id="/db/GetPost"></a>

**路径**
- POST `/db/GetPost`

**请求**
```ts
interface ReqGetPost {
    _id: string
}
```

**响应**
```ts
interface ResGetPost {
    /** 数据表 */
    post: {
        /** 默认主键 */
        _id: /*ObjectId*/ string,
        /** 作者 */
        author: string,
        /** 标题 */
        title: string,
        /** 内容 */
        content: string,
        /** 访问数量 */
        visitedNum: number,
        /** 创建信息 */
        create: {
            uid: string,
            time: /*datetime*/ string
        },
        /** 更新信息 */
        update?: {
            uid: string,
            time: /*datetime*/ string
        }
    }
}
```

---

### UpdatePost <a id="/db/UpdatePost"></a>

**路径**
- POST `/db/UpdatePost`

**请求**
```ts
interface ReqUpdatePost {
    update: {/** 默认主键 */
        _id: /*ObjectId*/ string
    } & {
        /** 标题 */
        title?: string,
        /** 内容 */
        content?: string
    }
}
```

**响应**
```ts
interface ResUpdatePost {
    matchedCount: number
}
```

---

## MatchStart <a id="/MatchStart"></a>

**路径**
- POST `/MatchStart`

**请求**
```ts
interface ReqMatchStart {

}
```

**响应**
```ts
interface ResMatchStart {
    serverUrl: string,
    roomId: string
}
```

---

## RoomCreate <a id="/RoomCreate"></a>

**路径**
- POST `/RoomCreate`

**请求**
```ts
interface ReqRoomCreate {
    roomName: string
}
```

**响应**
```ts
interface ResRoomCreate {
    serverUrl: string,
    roomId: string
}
```

---

## RoomList <a id="/RoomList"></a>

**路径**
- POST `/RoomList`

**请求**
```ts
interface ReqRoomList {

}
```

**响应**
```ts
interface ResRoomList {
    rooms: {
        /** 房间名 */
        name: string,
        /** 当前玩家数量 */
        playerNum: /*uint*/ number,
        /** 最大玩家数量 */
        playerMax: /*uint*/ number,
        /** 房间服务器地址 */
        serverUrl: string,
        /** 房间编号 */
        roomId: string
    }[]
}
```

