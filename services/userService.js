const userModel = require("../models/userModel");

/* Implement Auth Behaviors */
exports.signup = async (userMetadata, done) => {
  try {
    console.log(userMetadata);
    let newUser = new userModel({
      issuer: userMetadata.issuer,
      email: userMetadata.email
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error(error);
    return done(error, null);
  }
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

exports.updateUser = async (issuer, formData) => {
  try {
    const existingUser = await userModel.findOne({ issuer });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const allowedFields = ['address', 'first_name', 'last_name', 'nationality'];
    allowedFields.forEach(field => {
      if (formData[field]) {
        existingUser[field] = formData[field];
      }
    });

    await existingUser.save();

    return existingUser;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};