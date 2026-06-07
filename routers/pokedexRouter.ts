import express from "express";
import hasProfile from "../middleware/hasProfile";

export function pokedexRouter() {
    const router = express.Router();

    router.get("/pokedex", hasProfile, async (req, res) => {
        res.render("pokedex");
    });

    return router;
}