const createHandler = require("azure-function-express").createHandler;
const app = require("../utils/expressWrapper").app();
const passport = require("../utils/expressWrapper").passport();
const prefix = "/api/files";
// Create express app as usual

app.post(prefix + '/', passport.authenticate('oauth-bearer', {session: false}), async (req, res) => {
  // todo: post file
});

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
