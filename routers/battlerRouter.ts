import express from "express";
import hasProfile from "../middleware/hasProfile";

export function battlerRouter() {
    const router = express.Router();

    router.get("/battler", hasProfile, async (req, res) => {
        res.render("battler");
    });

    return router;
}