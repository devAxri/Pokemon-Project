import express from "express";
import hasProfile from "../middleware/hasProfile";

export function catchRouter() {
    const router = express.Router();

    router.get("/catch", hasProfile, async (req, res) => {
        res.render("catch");
    });

    return router;
}