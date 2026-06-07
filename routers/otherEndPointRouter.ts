import express from "express";
import hasProfile from "../middleware/hasProfile";
import { ProfileInfo } from "../interfaces/profileInfo";
import { CustomPokemonStats } from "../interfaces/customPokemonStats";
import { UserPokemon } from "../interfaces/userPokemon";
import * as databaseFunctions from "../database";

export function otherEndPointRouter() {
    const router = express.Router();

    router.get("/api/profileinfo", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const result: ProfileInfo | null = await databaseFunctions.findProfileInfo(email);
        if (!result) {
            return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
        }

        return res.status(200).json({ email: result.email, username: result.username, buddyId: result.buddyId, profilePic: result.profilePic, badgeList: result.badgeList, dateStart: result.dateStart, amountBattles: result.amountBattles, amountBattlesWin: result.amountBattlesWin, amountBattlesLose: result.amountBattlesLose });
    });

    router.get("/api/getallpokemon", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const result: UserPokemon | null = await databaseFunctions.getAllPokemon(email);
        if (!result) {
            return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
        }

        result.idPokemonList = result.idPokemonList.map(id => Number(id));
        result.pokemonList = result.pokemonList.map(id => Number(id));

        const count = result.idPokemonList.length;

        return res.status(200).json({ allCustomIDPokemon: result.pokemonList, actualIDAllPokemon: result.idPokemonList, totalCaught: count });
    });


    router.get("/api/customidinfo/:id", hasProfile, async (req, res) => {
        const result: CustomPokemonStats | null = await databaseFunctions.getPokemonStats(parseInt(req.params.id));
        if (!result) {
            return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
        }

        return res.status(200).json({ actualId: result.actualPokemonId, health: result.health, attack: result.attack, defence: result.defence, name: result.name, dateCaught: result.dateCaught, amountBattlesWin: Number(result.amountBattlesWin), amountBattlesLose: Number(result.amountBattlesLose) });
    });

    router.get("/api/getallcustompokemon", hasProfile, async (req, res) => {
        const result = await databaseFunctions.getAllCustom();
        if (result) {
            return res.status(200).json(result);
        }
    });

    router.post("/api/changebuddy", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;
        const buddyId = req.body.buddyId;

        const result = await databaseFunctions.changeBuddy(email, Number(buddyId));
        if (result) {
            return res.status(200).json({ status: "success" })
        }
    });

    router.post("/api/change", hasProfile, async (req, res) => {
        const sessionEmail = req.session.authentication.email;

        const username = req.body.username;
        const email = req.body.email;

        const result = await databaseFunctions.changeProfile(sessionEmail, username, email);
        req.session.authentication.email = email;

        if (result.acknowledged) {
            return res.status(200).json({ status: "success" })
        }
    });

    router.post("/api/catchpokemon", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const pokemonId = req.body.pokemonId;
        const name = req.body.name;

        let customPokemonId = await databaseFunctions.registerPokemon(parseInt(pokemonId), name);

        const result = await databaseFunctions.addPokemon(email, customPokemonId, pokemonId);
        if (result) {
            return res.status(200).json({ status: "success", id: customPokemonId })
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    router.post("/api/addrandomstat", hasProfile, async (req, res) => {
        const pokemonId = req.body.pokemonId;
        const stat = req.body.stat;

        const result = await databaseFunctions.updatePokemonStats(pokemonId, stat);
        if (result) {
            return res.status(200).json({ status: "success" })
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    router.post("/api/updatebattlestats", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const whatChanged: string = req.body.whatChanged;
        let amount: number = req.body.amount;

        const result = await databaseFunctions.updateAmountBattles(email, whatChanged, amount);
        if (result) {
            return res.status(200).json({ status: "success" })
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    router.post("/api/addbadge", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;
        const badgeId = req.body.badgeId;

        const result = await databaseFunctions.addBadge(email, badgeId);
        if (result) {
            return res.status(200).json({ status: "success" })
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    router.get("/api/getbadges", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const badges = await databaseFunctions.getBadges(email);
        if (badges) {
            return res.status(200).json({ badgeList: badges });
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    router.post("/api/releasepokemon", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const pokemonId = req.body.pokemonId;

        const result = await databaseFunctions.releasePokemon(email, pokemonId);
        if (result) {
            return res.status(200).json({ status: "success" })
        }
    });

    router.post("/api/changestats", hasProfile, async (req, res) => {
        const customId = req.body.customId;
        const stat = req.body.stat;
        const plusOrMinus = req.body.plusOrMinus;

        const result = await databaseFunctions.changeStats(customId, stat, plusOrMinus);
        if (result) {
            return res.status(200).json({ status: "success" })
        }
    });

    return router;
}