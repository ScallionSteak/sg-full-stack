import { ServiceProto } from 'tsrpc-proto';
import { MsgRoomUpdateState } from './room/admin/MsgRoomUpdateState';
import { ReqAuth, ResAuth } from './room/admin/PtlAuth';
import { ReqRoomCreate, ResRoomCreate } from './room/admin/PtlRoomCreate';
import { MsgPlayerMove } from './room/client/MsgPlayerMove';
import { MsgPlayerState } from './room/client/MsgPlayerState';
import { ReqRoomChat, ResRoomChat } from './room/PtlRoomChat';
import { ReqRoomJoin, ResRoomJoin } from './room/PtlRoomJoin';
import { ReqRoomLeave, ResRoomLeave } from './room/PtlRoomLeave';
import { MsgChat } from './room/server/MsgChat';
import { MsgPlayerAttack } from './room/server/MsgPlayerAttack';
import { MsgPlayerJoin } from './room/server/MsgPlayerJoin';
import { MsgPlayerLeave } from './room/server/MsgPlayerLeave';
import { MsgPlayerMove as MsgPlayerMove_1 } from './room/server/MsgPlayerMove';
import { MsgRoomPlayerState } from './room/server/MsgRoomPlayerState';

export interface ServiceType {
    api: {
        "admin/Auth": {
            req: ReqAuth,
            res: ResAuth
        },
        "admin/RoomCreate": {
            req: ReqRoomCreate,
            res: ResRoomCreate
        },
        "RoomChat": {
            req: ReqRoomChat,
            res: ResRoomChat
        },
        "RoomJoin": {
            req: ReqRoomJoin,
            res: ResRoomJoin
        },
        "RoomLeave": {
            req: ReqRoomLeave,
            res: ResRoomLeave
        }
    },
    msg: {
        "admin/RoomUpdateState": MsgRoomUpdateState,
        "client/PlayerMove": MsgPlayerMove,
        "client/PlayerState": MsgPlayerState,
        "server/Chat": MsgChat,
        "server/PlayerAttack": MsgPlayerAttack,
        "server/PlayerJoin": MsgPlayerJoin,
        "server/PlayerLeave": MsgPlayerLeave,
        "server/PlayerMove": MsgPlayerMove_1,
        "server/RoomPlayerState": MsgRoomPlayerState
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 11,
    "services": [
        {
            "id": 0,
            "name": "admin/RoomUpdateState",
            "type": "msg"
        },
        {
            "id": 1,
            "name": "admin/Auth",
            "type": "api"
        },
        {
            "id": 2,
            "name": "admin/RoomCreate",
            "type": "api",
            "conf": {
                "allowGuest": true
            }
        },
        {
            "id": 23,
            "name": "client/PlayerMove",
            "type": "msg"
        },
        {
            "id": 15,
            "name": "client/PlayerState",
            "type": "msg"
        },
        {
            "id": 5,
            "name": "RoomChat",
            "type": "api"
        },
        {
            "id": 6,
            "name": "RoomJoin",
            "type": "api"
        },
        {
            "id": 7,
            "name": "RoomLeave",
            "type": "api"
        },
        {
            "id": 17,
            "name": "server/Chat",
            "type": "msg"
        },
        {
            "id": 21,
            "name": "server/PlayerAttack",
            "type": "msg"
        },
        {
            "id": 18,
            "name": "server/PlayerJoin",
            "type": "msg"
        },
        {
            "id": 19,
            "name": "server/PlayerLeave",
            "type": "msg"
        },
        {
            "id": 22,
            "name": "server/PlayerMove",
            "type": "msg"
        },
        {
            "id": 20,
            "name": "server/RoomPlayerState",
            "type": "msg"
        }
    ],
    "types": {
        "admin/MsgRoomUpdateState/MsgRoomUpdateState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "rooms",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../../types/RoomState/RoomState"
                        }
                    }
                }
            ]
        },
        "../../types/RoomState/RoomState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "playerNum",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 3,
                    "name": "playerMax",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 4,
                    "name": "timeUpdate",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 5,
                    "name": "timeStartMatch",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    },
                    "optional": true
                }
            ]
        },
        "admin/PtlAuth/ReqAuth": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "adminToken",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "type",
                    "type": {
                        "type": "Literal",
                        "literal": "MatchServer"
                    }
                }
            ]
        },
        "admin/PtlAuth/ResAuth": {
            "type": "Interface"
        },
        "admin/PtlRoomCreate/ReqRoomCreate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "adminToken",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "roomName",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "admin/PtlRoomCreate/ResRoomCreate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "client/MsgPlayerMove/MsgPlayerMove": {
            "target": {
                "type": "Reference",
                "target": "../../types/PlayerState/PlayerMove"
            },
            "keys": [
                "uid"
            ],
            "type": "Omit"
        },
        "../../types/PlayerState/PlayerMove": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "target",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerPosition"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "vector",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerPosition"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "angle",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "action",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "../../types/PlayerState/PlayerPosition": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "z",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "client/MsgPlayerState/MsgPlayerState": {
            "target": {
                "type": "Reference",
                "target": "../../types/RoomPlayerState/RoomPlayerState"
            },
            "keys": [
                "uid"
            ],
            "type": "Omit"
        },
        "../../types/RoomPlayerState/RoomPlayerState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "pos",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerPosition"
                    }
                },
                {
                    "id": 2,
                    "name": "rotation",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerRotation"
                    }
                },
                {
                    "id": 4,
                    "name": "action",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "../../types/PlayerState/PlayerRotation": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "x",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "y",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "z",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "w",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlRoomChat/ReqRoomChat": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "../base/BaseRequest": {
            "type": "Interface"
        },
        "PtlRoomChat/ResRoomChat": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ]
        },
        "../base/BaseResponse": {
            "type": "Interface"
        },
        "PtlRoomJoin/ReqRoomJoin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "nickname",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlRoomJoin/ResRoomJoin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "playerInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerInfo/PlayerInfo"
                    }
                },
                {
                    "id": 1,
                    "name": "room",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/RoomData/RoomData"
                    }
                }
            ]
        },
        "../../types/PlayerInfo/PlayerInfo": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "nickname",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "../../types/RoomData/RoomData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "name",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "playerMax",
                    "type": {
                        "type": "Number",
                        "scalarType": "uint"
                    }
                },
                {
                    "id": 3,
                    "name": "players",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Intersection",
                            "members": [
                                {
                                    "id": 0,
                                    "type": {
                                        "type": "Reference",
                                        "target": "../../types/PlayerInfo/PlayerInfo"
                                    }
                                },
                                {
                                    "id": 1,
                                    "type": {
                                        "type": "Interface",
                                        "properties": [
                                            {
                                                "id": 0,
                                                "name": "pos",
                                                "type": {
                                                    "type": "Reference",
                                                    "target": "../../types/PlayerState/PlayerPosition"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "id": 2,
                                    "type": {
                                        "type": "Interface",
                                        "properties": [
                                            {
                                                "id": 0,
                                                "name": "rotation",
                                                "type": {
                                                    "type": "Reference",
                                                    "target": "../../types/PlayerState/PlayerRotation"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    "id": 4,
                    "name": "timeLastEmpty",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "timeStartMatch",
                    "type": {
                        "type": "Number"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "timeUpdate",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 7,
                    "name": "messages",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "time",
                                    "type": {
                                        "type": "Date"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "playerInfo",
                                    "type": {
                                        "type": "Reference",
                                        "target": "../../types/PlayerInfo/PlayerInfo"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "content",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "PtlRoomLeave/ReqRoomLeave": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseRequest"
                    }
                }
            ]
        },
        "PtlRoomLeave/ResRoomLeave": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "../base/BaseResponse"
                    }
                }
            ]
        },
        "server/MsgChat/MsgChat": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                },
                {
                    "id": 1,
                    "name": "playerInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerInfo/PlayerInfo"
                    }
                },
                {
                    "id": 2,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "server/MsgPlayerAttack/MsgPlayerAttack": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "targetId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "skillId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "server/MsgPlayerJoin/MsgPlayerJoin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                },
                {
                    "id": 1,
                    "name": "playerInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerInfo/PlayerInfo"
                    }
                },
                {
                    "id": 2,
                    "name": "pos",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerPosition"
                    }
                },
                {
                    "id": 3,
                    "name": "rotation",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerRotation"
                    }
                }
            ]
        },
        "server/MsgPlayerLeave/MsgPlayerLeave": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                },
                {
                    "id": 1,
                    "name": "playerInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerInfo/PlayerInfo"
                    }
                }
            ]
        },
        "server/MsgPlayerMove/MsgPlayerMove": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "state",
                    "type": {
                        "type": "Reference",
                        "target": "../../types/PlayerState/PlayerMove"
                    }
                }
            ]
        },
        "server/MsgRoomPlayerState/MsgRoomPlayerState": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "states",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "String",
                            "type": {
                                "type": "Reference",
                                "target": "../../types/RoomPlayerState/RoomPlayerState"
                            }
                        }
                    }
                }
            ]
        }
    }
};