import express from "express";
import hasProfile from "../middleware/hasProfile";

export function compareRouter() {
    const router = express.Router();

    router.get("/compare", hasProfile, async (req, res) => {

        res.render("compare");
    });

    return router;
}