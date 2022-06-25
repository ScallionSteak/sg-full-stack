import { DbUser } from "../../../db/DbUser";

export interface ReqAddPost {
    newPost: Omit<DbUser, '_id' | 'create' | 'update' | 'visitedNum'>;
}

export interface ResAddPost {
    insertedId: string;
}