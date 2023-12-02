const passport = require("passport");
const { Strategy: MagicStrategy } = require("passport-magic");
const magic = require("../config/magic");
const { login, signup } = require("../services/authService");
const userModel = require("../models/userModel")

const strategy = new MagicStrategy(async function (user, done) {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  const existingUser = await userModel.findOne({ issuer: user.issuer });
  if (!existingUser) {
    /* Create a new user if doesn't exist */
    return signup(user, userMetadata, done);
  } else {
    /* Login user if otherwise */
    return login(user, done);
  }
});
passport.serializeUser((user, done) => {
  console.log("----------user", user)
  done(null, user.issuer);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById({ 'issuer': id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
passport.use(strategy);

module.exports = passport;
