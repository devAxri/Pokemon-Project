import { ObjectId } from 'mongodb';

export interface ProfileInfo {
    _id: ObjectId;
    email: string;
    username: string;
    buddyId: number;
    profilePic: string;
    badgeList: Array<number>;
    dateStart: number;
    amountBattles: number,
    amountBattlesWin: number,
    amountBattlesLose: number
}