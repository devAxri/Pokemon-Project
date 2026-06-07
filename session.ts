const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: "sessions-mongodb",
    databaseName: "main"
});

declare module 'express-session' {
    interface SessionData {
        authentication: any;
    }
}

export default session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 24 * 1000 }, // 1 day, this is in miliseconds
    saveUninitialized: false,
    resave: false,
    store: store
})