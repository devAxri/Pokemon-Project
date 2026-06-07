import express from "express";

// Importing all of our routers
import { indexRouter } from "./routers/indexRouter";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";
import { accountuserRouter } from "./routers/accountuserRouter";
import { setupRouter } from "./routers/setupRouter";
import { homeRouter } from "./routers/homeRouter";
import { battlerRouter } from "./routers/battlerRouter";
import { otherEndPointRouter } from "./routers/otherEndPointRouter";
import { changePasswordRouter } from "./routers/changePasswordRouter";
import { compareRouter } from "./routers/compareRouter";
import { viewRouter } from "./routers/viewRouter";
import { pokedexRouter } from "./routers/pokedexRouter";
import { logoutRouter } from "./routers/logoutRouter";
import { catchRouter } from "./routers/catchRouter";
import { whoseThatPokemonRouter } from "./routers/whoseThatPokemonRouter";

// Importing the session
import session from "./session";

// Making the express instance
const app = express();

// Defining the express settings
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT);
app.use(express.json());
app.use(session)

// Using all of our routers
app.use("/", indexRouter());
app.use("/", loginRouter());
app.use("/", registerRouter());
app.use("/", accountuserRouter());
app.use("/", setupRouter());
app.use("/", homeRouter());
app.use("/", battlerRouter());
app.use("/", otherEndPointRouter());
app.use("/", changePasswordRouter());
app.use("/", compareRouter());
app.use("/", viewRouter());
app.use("/", pokedexRouter());
app.use("/", logoutRouter());
app.use("/", catchRouter());
app.use("/", whoseThatPokemonRouter());

app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
);