import { ObjectId } from 'mongodb';

export interface UserPokemon {
    _id: ObjectId;
    email: string;
    pokemonList: Array<number>;
    idPokemonList: Array<number>;
}