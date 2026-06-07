import express from "express";
import * as databaseFunctions from "../database";
import authenticate from "../middleware/authenticate";

export function setupRouter() {
    const router = express.Router();

    router.get("/setup", authenticate, async (req, res) => {
        res.render("setup");
    });

    router.post("/api/setup", authenticate, async (req, res) => {
        const username = req.body.username;
        const pokemonName = req.body.pokemonName;
        const profilePic = req.body.profilePic;

        let pokemonId = 0;

        switch (pokemonName) {
            case "bulbasaur":
                pokemonId = 1;
                break;
            case "charmander":
                pokemonId = 4;
                break;
            case "squirtle":
                pokemonId = 7;
                break;
            case "chikorita":
                pokemonId = 152;
                break;
            case "cyndaquil":
                pokemonId = 155;
                break;
            case "totodile":
                pokemonId = 158;
                break;
            case "treecko":
                pokemonId = 252;
                break;
            case "torchic":
                pokemonId = 255;
                break;
            case "rowlet":
                pokemonId = 722;
                break;
        }

        const customPokemonId = await databaseFunctions.registerPokemon(pokemonId, "None");
        const dateStart = Math.floor(Date.now() / 1000);

        const email = req.session.authentication.email;

        const setupProfileInfoResult = await databaseFunctions.setupProfileInfo(email, username, customPokemonId, profilePic, dateStart);
        const userPokemonSetupResult = await databaseFunctions.userPokemonSetup(email, customPokemonId, pokemonId);

        if (setupProfileInfoResult.acknowledged && userPokemonSetupResult.acknowledged) {
            return res.status(200).json({ status: "success" })
        }

        return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." });
    });

    return router;
}