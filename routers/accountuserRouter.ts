import express from "express";
import hasProfile from "../middleware/hasProfile";

export function accountuserRouter() {
    const router = express.Router();

    router.get("/accountuser", hasProfile, async (req, res) => {

        const state = req.query.state;
        if (state === "success") {
            res.render("accountuser", { infoField: "Wijzigingen succesvol." });
        } else {
            res.render("accountuser", { infoField: null });
        }
    });

    return router;
}