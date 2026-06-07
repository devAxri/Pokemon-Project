import express from "express";
import hasProfile from "../middleware/hasProfile";

export function homeRouter() {
    const router = express.Router();

    router.get("/home", hasProfile, async (req, res) => {
        res.render("home");
    });

    return router;
}