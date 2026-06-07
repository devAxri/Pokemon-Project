import express from "express";
import hasProfile from "../middleware/hasProfile";
import * as databaseFunctions from "../database";

export function changePasswordRouter() {
    const router = express.Router();

    router.post("/api/changepassword", hasProfile, async (req, res) => {
        const email = req.session.authentication.email;
        const currentPassword = req.body.currentPassword;

        const newpassword = req.body.newpassword;
        const newpasswordrepeat = req.body.newpasswordrepeat;

        if (newpassword != newpasswordrepeat) {
            return res.status(500).json({ error: "Wachtwoorden komen niet overeen, probeer het opnieuw." });
        }

        const result = await databaseFunctions.changePassword(email, currentPassword, newpassword);

        if (result?.acknowledged) {
            return res.status(200).json({ status: "success" })
        }
    });

    return router;
}