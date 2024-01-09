const passport = require("passport");
const { Strategy: MagicStrategy } = require("passport-magic");
const magic = require("../config/magic");
const { login, signup } = require("../services/userService");
const userModel = require("../models/userModel")

const strategy = new MagicStrategy(async function (user, done) {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  const existingUser = await userModel.findOne({ issuer: user.issuer });
  console.log("I am here")

  if (!existingUser) {
    /* Create a new user if doesn't exist */
    console.log("Existing",existingUser)
    return signup(user, userMetadata, done);
  } else {
    /* Login user if otherwise */
    console.log("Login")
    return login(user, done);
  }
});
passport.serializeUser((user, done) => {
  console.log("----------user", user);
  console.log("----------user.issuer", user.issuer);
  done(null, user.issuer);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findOne({ 'issuer': id.issuer });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
passport.use(strategy);

module.exports = passport;
