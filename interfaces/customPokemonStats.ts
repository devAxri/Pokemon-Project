import { ObjectId } from 'mongodb';

export interface CustomPokemonStats {
    _id: ObjectId;
    customId: number;
    actualPokemonId: number;
    health: number;
    attack: number;
    defence: number;
    name: string;
    dateCaught: number;
    amountBattlesWin: number,
    amountBattlesLose: number
}