import express from "express";
import { Account } from "../interfaces/account";
import * as databaseFunctions from "../database";
import authenticateRegister from "../middleware/authenticateRegister";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", authenticateRegister, async (req, res) => {
        return res.render("login");
    });

    router.post("/api/login", async (req, res) => {
        try {
            // Grabbing all the values from the post request
            const email = req.body.email;
            const password = req.body.password;
            const captchaResponse = req.body.captchaResponse;

            // Variables for checking the captcha
            const secretKey = "0x0000000000000000000000000000000000000000";
            const verifyUrl = "https://api.hcaptcha.com/siteverify";

            // Making the data array for the post request to hcaptcha
            const data = { secret: secretKey, response: captchaResponse };

            // Making a requemail: string, amountBattles: anyest to hcaptcha to check if the captcha was completed successfully
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

            // Running the login function, this will return the account object if credentials were correct, else it'll return null
            const loginAccount: Account | null = await databaseFunctions.loginAccount(email, password);
            if (!loginAccount) {
                return res.status(401).json({ error: "Inloggen mislukt, probeer het opnieuw." })
            }

            // Deleting the password from this object
            delete loginAccount.password;

            req.session.authentication = loginAccount;

            // If both exist, then return success and a session cookie
            res.status(201).json({ status: "success" })

        } catch (error) {

            res.status(500).json({ error: "Internal server error " + error })

        }
    });

    return router;
}