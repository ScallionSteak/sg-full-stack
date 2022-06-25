import { DbUser } from "../../../db/DbUser";

export interface ReqUpdatePost {
    update: Pick<DbUser, '_id'> & Partial<Pick<DbUser, 'title' | 'content'>>;
}

export interface ResUpdatePost {
    matchedCount: number;
}