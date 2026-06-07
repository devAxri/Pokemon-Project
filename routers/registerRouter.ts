import express from "express";
import * as databaseFunctions from "../database";
import authenticateRegister from "../middleware/authenticateRegister";

export function registerRouter() {
    const router = express.Router();

    router.get("/register", authenticateRegister, async (req, res) => {
        return res.render("register");
    });

    router.post("/api/register", async (req, res) => {
        try {
            // Grabbing all the values from the post request
            const email = req.body.email;
            const password = req.body.password;
            const passwordRepeat = req.body.passwordRepeat;
            const captchaResponse = req.body.captchaResponse;

            // Variables for checking the captcha
            const secretKey = "0x0000000000000000000000000000000000000000";
            const verifyUrl = "https://api.hcaptcha.com/siteverify";

            // Making the data array for the post request to hcaptcha
            const data = { secret: secretKey, response: captchaResponse };

            // Making a request to hcaptcha to check if the captcha was completed successfully
            const response = await fetch(verifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            });

            // Checking if the captcha was completed succesfully
            if (!response.ok) {
                return res.status(500).json({ error: "Er is iets fout gegaan tijdens het controleren van de captcha, probeer het opnieuw." })
            }
            const responseData = await response.json();

            if (!responseData.success) {
                return res.status(403).json({ error: "Captcha was niet correct." })
            }

            // Checking if passwords are the same
            if (password !== passwordRepeat) {
                return res.status(500).json({ error: "Wachtwoorden komen niet overeen, probeer het opnieuw." })
            }

            // Inserting the credentials into the database
            const registerAccount = await databaseFunctions.registerAccount(email, password);
            if (!registerAccount) {
                return res.status(500).json({ error: "Er is iets fout gegaan, probeer het opnieuw." })
            }

            // Deleting the password from this object
            delete registerAccount.password;

            req.session.authentication = registerAccount;

            res.status(201).json({ status: "success" })

        } catch (error) {

            res.status(500).json({ error: "Internal server error " + error })

        }
    });

    return router;
}