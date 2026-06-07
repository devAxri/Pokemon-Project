import { MongoClient, ObjectId } from "mongodb";

// Import our interfaces
import { Account } from "./interfaces/account";
import { ProfileInfo } from "./interfaces/profileInfo";
import { CustomPokemonStats } from "./interfaces/customPokemonStats";
import { UserPokemon } from "./interfaces/userPokemon";

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
console.log("[server] Successfully parsed ENV values")

const saltRounds: number = 10;

const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017");
client.connect();
console.log("[server] Successfully connected to MongoDB");

const main = client.db("main");
const accountsCollection = main.collection("accounts");
const profileinfoCollection = main.collection("profileinfo");
const userpokemonCollection = main.collection("userpokemon");
const custompokemonstatsCollection = main.collection("custompokemonstats");

console.log("[server] Successfully initialized collections");

export async function getAllPlayerCount() {
    return await accountsCollection.countDocuments({});
}

export async function loginAccount(email: string, password: string): Promise<Account | null> {
    const accountDetails: Account | null = await accountsCollection.findOne<Account>({ email });
    if (!accountDetails) {
        return null;
    }
    const isPasswordCorrect = await bcrypt.compareSync(password, accountDetails.password);
    if (!isPasswordCorrect) {
        return null;
    }
    return accountDetails;
}

export async function registerAccount(email: string, password: string) {
    const accountDetails: Account | null = await accountsCollection.findOne<Account>({ email });
    if (accountDetails) {
        return null;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertDocument = await accountsCollection.insertOne({ email, password: hashedPassword });

    const newAccountDetails: Account | null = await accountsCollection.findOne<Account>({ _id: insertDocument.insertedId });
    return newAccountDetails;
}

export async function hasProfile(email: string): Promise<boolean> {
    const result: ProfileInfo | null = await profileinfoCollection.findOne<ProfileInfo>({ email });
    if (!result) {
        return false;
    }
    return true;
}

export async function registerPokemon(pokemonId: number, name: string) {
    const count = await custompokemonstatsCollection.countDocuments();
    const newPokemonId = count + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    const health = data.stats[0].base_stat;
    const attack = data.stats[1].base_stat;
    const defence = data.stats[2].base_stat;

    let actual_name = "";
    if (name == "None") {
        actual_name = data.name;
    } else {
        actual_name = name;
    }

    actual_name = actual_name.toLowerCase();

    const userPokemonSetup: CustomPokemonStats = {
        _id: new ObjectId(),
        customId: newPokemonId,
        actualPokemonId: pokemonId,
        health: health,
        attack: attack,
        defence: defence,
        name: actual_name,
        dateCaught: Math.floor(Date.now()),
        amountBattlesWin: 0,
        amountBattlesLose: 0
    }

    return await custompokemonstatsCollection.insertOne(userPokemonSetup), newPokemonId;
}

export async function setupProfileInfo(email: string, username: string, buddyId: number, profilePic: string, dateStart: number) {
    const profileInfoSetup: ProfileInfo = {
        _id: new ObjectId(),
        email: email,
        username: username,
        buddyId: buddyId,
        profilePic: profilePic,
        badgeList: [],
        dateStart: dateStart,
        amountBattles: 0,
        amountBattlesWin: 0,
        amountBattlesLose: 0
    }
    return await profileinfoCollection.insertOne(profileInfoSetup);
}

export async function userPokemonSetup(email: string, customPokemonId: number, pokemonId: number) {
    const userPokemonSetup: UserPokemon = {
        _id: new ObjectId(),
        email: email,
        pokemonList: [customPokemonId],
        idPokemonList: [pokemonId]
    }
    return await userpokemonCollection.insertOne(userPokemonSetup);
}

export async function findProfileInfo(email: string): Promise<ProfileInfo | null> {
    const result: ProfileInfo | null = await profileinfoCollection.findOne<ProfileInfo>({ email });
    return result;
}

export async function getAllPokemon(email: string): Promise<UserPokemon | null> {
    const result: UserPokemon | null = await userpokemonCollection.findOne<UserPokemon>({ email });
    return result;
}

export async function getPokemonStats(pokemonId: number): Promise<CustomPokemonStats | null> {
    const result: CustomPokemonStats | null = await custompokemonstatsCollection.findOne<CustomPokemonStats>({ customId: pokemonId });
    return result;
}

export async function changePassword(email: string, oldPassword: string, newPassword: string) {
    const accountDetails: Account | null = await accountsCollection.findOne<Account>({ email });
    if (!accountDetails) {
        return null;
    }

    const isPasswordCorrect = await bcrypt.compareSync(oldPassword, accountDetails.password);
    if (!isPasswordCorrect) {
        return null;
    }

    const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);
    const result = await accountsCollection.updateOne({ email }, { $set: { password: hashedPassword } });
    return result;
}

export async function getAllCustom() {
    return await custompokemonstatsCollection.find({}).toArray();
}

export async function changeBuddy(email: string, pokemonId: number) {
    const profileinfoCheck = await findProfileInfo(email);
    if (!profileinfoCheck) {
        return false
    }
    return await profileinfoCollection.updateOne({ email }, { $set: { buddyId: pokemonId } });
}

export async function changeProfile(email: string, username: string, email2: string) {
    return await profileinfoCollection.updateOne({ email }, { $set: { username, email: email2 } }) && await accountsCollection.updateOne({ email }, { $set: { email: email2 } }) && await userpokemonCollection.updateOne({ email }, { $set: { email: email2 } });
}

export async function addPokemon(email: string, customPokemonId: number, pokemonId: number) {
    const userPokemon: UserPokemon | null = await getAllPokemon(email);
    if (!userPokemon) {
        return false
    }
    customPokemonId = Number(customPokemonId);
    pokemonId = Number(pokemonId);

    const updatedPokemonList = [...userPokemon.idPokemonList, pokemonId];
    const updatedCustomPokemonList = [...userPokemon.pokemonList, customPokemonId];

    return await userpokemonCollection.updateOne({ email }, { $set: { pokemonList: updatedCustomPokemonList, idPokemonList: updatedPokemonList } });
}

export async function updatePokemonStats(pokemonId: number, stat: string) {
    const currentStats = await custompokemonstatsCollection.findOne({ customId: Number(pokemonId) });

    if (stat == "health") {
        return await custompokemonstatsCollection.updateOne({ customId: Number(pokemonId) }, { $set: { health: currentStats?.health + 1 } });
    }
    else if (stat == "attack") {
        return await custompokemonstatsCollection.updateOne({ customId: Number(pokemonId) }, { $set: { attack: currentStats?.attack + 1 } });
    }
    else if (stat == "defence") {
        return await custompokemonstatsCollection.updateOne({ customId: Number(pokemonId) }, { $set: { defence: currentStats?.defence + 1 } });
    }
}

export async function updateAmountBattles(email: string, whatchanged: string, newAmountBattles: number) {
    const profileinfoGet = await findProfileInfo(email);
    if (!profileinfoGet) {
        return false
    }

    const currentBattles = profileinfoGet.amountBattles;
    const newCurrentBattles = currentBattles + 1;

    if (whatchanged == "win") {
        return await profileinfoCollection.updateOne({ email }, { $set: { amountBattles: newCurrentBattles, amountBattlesWin: newAmountBattles } });
    }
    else {
        return await profileinfoCollection.updateOne({ email }, { $set: { amountBattles: newCurrentBattles, amountBattlesLose: newAmountBattles } });
    }
}

export async function addBadge(email: string, badgeId: number) {
    const profileinfoCheck = await findProfileInfo(email);
    if (!profileinfoCheck) {
        return false
    }

    const updatedBadgeList = [...profileinfoCheck.badgeList, badgeId];
    return await profileinfoCollection.updateOne({ email }, { $set: { badgeList: updatedBadgeList } });
}

export async function getBadges(email: string) {
    const profileinfoCheck = await findProfileInfo(email);
    if (!profileinfoCheck) {
        return null
    }
    return profileinfoCheck.badgeList;
}

export async function releasePokemon(email: string, customId: number) {
    const userPokemon: UserPokemon | null = await getAllPokemon(email);
    if (!userPokemon) {
        return false
    }

    const customIdNum = Number(customId);

    const actualId = await getPokemonStats(customIdNum);
    const actualIdPokemon = actualId?.actualPokemonId;

    let pokemonListNew: number[] = [];
    let idPokemonListNew: number[] = [];

    userPokemon.pokemonList.forEach(element => {
        if (element != customIdNum) {
            pokemonListNew.push(element);
        }
    });

    userPokemon.idPokemonList.forEach(element => {
        if (element != actualIdPokemon) {
            idPokemonListNew.push(element);
        }
    });

    return await userpokemonCollection.updateOne({ email }, { $set: { pokemonList: pokemonListNew, idPokemonList: idPokemonListNew } }) && await custompokemonstatsCollection.deleteOne({ customId: customIdNum });
}

export async function changeStats(customId: number, stat: string, plusOrMinus: string) {
    const currentStats = await custompokemonstatsCollection.findOne({ customId: Number(customId) });

    if (stat == "amountWon") {
        if (plusOrMinus == "plus") {
            return await custompokemonstatsCollection.updateOne({ customId: Number(customId) }, { $set: { amountBattlesWin: Number(currentStats?.amountBattlesWin + 1) } });
        }
        else {
            return await custompokemonstatsCollection.updateOne({ customId: Number(customId) }, { $set: { amountBattlesWin: Number(currentStats?.amountBattlesWin - 1) } });
        }
    } else if (stat == "amountLost") {
        if (plusOrMinus == "plus") {
            return await custompokemonstatsCollection.updateOne({ customId: Number(customId) }, { $set: { amountBattlesLose: Number(currentStats?.amountBattlesLose + 1) } });
        }
        else {
            return await custompokemonstatsCollection.updateOne({ customId: Number(customId) }, { $set: { amountBattlesLose: Number(currentStats?.amountBattlesLose - 1) } });
        }
    }
}
