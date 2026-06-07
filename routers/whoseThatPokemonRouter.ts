import express from "express";
import hasProfile from "../middleware/hasProfile";

export function whoseThatPokemonRouter() {
    const router = express.Router();

    router.get("/whosthatpokemon", hasProfile, async (req, res) => {
        res.render("whosthatpokemon");
    });

    return router;
}