import express from "express";
import hasProfile from "../middleware/hasProfile";
import * as databaseFunctions from "../database";

export function viewRouter() {
    const router = express.Router();

    router.get("/view", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;

        const id = req.query.id;
        if (id == undefined) {
            const profileInfo = await databaseFunctions.findProfileInfo(email);
            const buddyId = profileInfo?.buddyId;
            const actualIdDbQuerry = await databaseFunctions.getPokemonStats(Number(buddyId));
            const actualId = actualIdDbQuerry?.actualPokemonId;

            return res.redirect("/view?id=" + actualId)
        }

        res.render("view");
    });

    return router;
}