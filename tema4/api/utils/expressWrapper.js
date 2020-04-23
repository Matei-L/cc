const express = (requiresToken = true) => {
    const express = require("express");
    const cors = require("cors");
    const bodyParser = require('body-parser');
    const sensitive = require('./sensitive.js');

    const app = express();

    // Automatically allow requests from our clients
    const whitelist = [sensitive.localClient(), sensitive.client()];
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                return callback(null, true)
            } else {
                console.log(origin + ' was blocked by cors!');
                return callback(new Error('Not allowed by CORS'))
            }
        }
    };
    app.use(cors(corsOptions));

    // for body
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    return app;
};

const passport = () => {
    const passport = require("passport");
    const config = require('./config');
    const BearerStrategy = require('passport-azure-ad').BearerStrategy;

    const bearerStrategy = new BearerStrategy(config,
        function (token, done) {
            // Send user info using the second argument
            done(null, {}, token);
        }
    );

    passport.use(bearerStrategy);

    return passport;
}


module.exports = {
    app: express,
    passport: passport
};
