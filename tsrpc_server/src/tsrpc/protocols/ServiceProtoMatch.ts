import { ServiceProto } from 'tsrpc-proto';
import { ReqRoomServerJoin, ResRoomServerJoin } from './match/admin/PtlRoomServerJoin';
import { ReqMatchStart, ResMatchStart } from './match/PtlMatchStart';
import { ReqRoomCreate, ResRoomCreate } from './match/PtlRoomCreate';
import { ReqRoomList, ResRoomList } from './match/PtlRoomList';

export interface ServiceType {
    api: {
        "admin/RoomServerJoin": {
            req: ReqRoomServerJoin,
            res: ResRoomServerJoin
        },
        "MatchStart": {
            req: ReqMatchStart,
            res: ResMatchStart
        },
        "RoomCreate": {
            req: ReqRoomCreate,
            res: ResRoomCreate
        },
        "RoomList": {
            req: ReqRoomList,
            res: ResRoomList
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 9,
    "services": [
        {
            "id": 0,
            "name": "admin/RoomServerJoin",
            "type": "api"
        },
        {
            "id": 4,
            "name": "MatchStart",
            "type": "api"
        },
        {
            "id": 5,
            "name": "RoomCreate",
            "type": "api"
        },
        {
            "id": 2,
            "name": "RoomList",
            "type": "api"
        }
    ],
    "types": {
        "admin/PtlRoomServerJoin/ReqRoomServerJoin": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "serverUrl",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "adminToken",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "admin/PtlRoomServerJoin/ResRoomServerJoin": {
            "type": "Interface"
        },
        "PtlMatchStart/ReqMatchStart": {
            "type": "Interface"
        },
        "PtlMatchStart/ResMatchStart": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "serverUrl",
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
        "PtlRoomCreate/ReqRoomCreate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomName",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlRoomCreate/ResRoomCreate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "serverUrl",
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
        "PtlRoomList/ReqRoomList": {
            "type": "Interface"
        },
        "PtlRoomList/ResRoomList": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "rooms",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "name",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 5,
                                    "name": "playerNum",
                                    "type": {
                                        "type": "Number",
                                        "scalarType": "uint"
                                    }
                                },
                                {
                                    "id": 7,
                                    "name": "playerMax",
                                    "type": {
                                        "type": "Number",
                                        "scalarType": "uint"
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "serverUrl",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 4,
                                    "name": "roomId",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
};