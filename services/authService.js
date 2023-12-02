const userModel = require("../models/userModel");

/* Implement Auth Behaviors */
exports.signup = async (user, userMetadata, done) => {
  let newUser = new userModel({
    issuer: user.issuer,
    email: userMetadata.email,
    lastLoginAt: user.claim.iat,
  });
  newUser.id = newUser._id;
  await newUser.save();
  return done(null, newUser);
};

exports.login = async (user, done) => {
  /* Replay attack protection (https://go.magic.link/replay-attack) */
  if (user.claim.iat <= user.lastLoginAt) {
    return done(null, false, {
      message: `Replay attack detected for user ${user.issuer}.`,
    });
  }
  await userModel.updateOne(
    { issuer: user.issuer },
    { $set: { lastLoginAt: user.claim.iat } }
  );
  return done(null, user);
};
