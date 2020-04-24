const createHandler = require("azure-function-express").createHandler;
const app = require("../utils/expressWrapper").app();
const passport = require("../utils/expressWrapper").passport();
const prefix = "/api/users";
// Create express app as usual
app.get(prefix + "/", (req, res) => {
  // todo: get users
});

app.post(prefix + '/', passport.authenticate('oauth-bearer', {session: false}), async (req, res) => {
  // todo: post current user
});
app.put(prefix + '/', passport.authenticate('oauth-bearer', {session: false}), async (req, res) => {
  // todo: update user
});

app.get(prefix + '/:uid', passport.authenticate('oauth-bearer', {session: false}), async (req, res) => {
  // todo get user with uid
  console.log(req.headers);
  console.log(req.params)
  res.status(200).json({
    uid: req.params.uid,
    email: 'dasdassd',
    description:'',
    nickname: 'Cel mai mare cocalar',
    photoUrl: 'https://theboyzstorage.blob.core.windows.net/images-container/casino-table-png-4.png',
    audioUrl: ''
  })
});
// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
