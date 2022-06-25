import { ObjectId } from "bson";
import { DbUser } from "../../../db/DbUser";

export interface ReqGetPost {
    _id: ObjectId;
}

export interface ResGetPost {
    post: DbUser;
}
