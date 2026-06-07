import express from "express";
import * as databaseFunctions from "../database";

export function indexRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const allPlayers = await databaseFunctions.getAllPlayerCount();
        res.render("index", { activeplayers: allPlayers + " actieve spelers" });
    });

    return router;
}