import express from "express";

export function logoutRouter() {
    const router = express.Router();

    router.get("/logout", async (req, res) => {
        req.session.destroy((err) =>
            console.log(err)
        );

        res.redirect("/");
    });

    return router;
}