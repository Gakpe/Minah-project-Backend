const passport = require("passport");
const CustomStrategy = require('passport-custom');
const magic = require("../config/magic");
const { login, signup } = require("../services/userService");
const userModel = require("../models/userModel")

passport.use('magic', new CustomStrategy(async function (req, done) {
  const { token } = req.query;
  console.log("Token = ", token);
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); 

      const userMetadata = await magic.users.getMetadataByToken(token);
      console.log(userMetadata);
  const existingUser = await userModel.findOne({ issuer: userMetadata.issuer });
  console.log("I am here")

  if (!existingUser) {
    /* Create a new user if doesn't exist */
    console.log("Existing",existingUser)
    return signup( userMetadata, done);
  } else {
    /* Login user if otherwise */
    console.log("Login")
    done(null, userMetadata);
    return userMetadata;
  }
}
}));
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

module.exports = passport;
