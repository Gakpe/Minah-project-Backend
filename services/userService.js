const userModel = require("../models/userModel");

/* Implement Auth Behaviors */
exports.signup = async (user, userMetadata, done) => {
  try {
    const lastUser = await userModel.findOne({}, { userId: 1 }, { sort: { userId: -1 } });

    let nextUserId;
    if (lastUser && lastUser.userId) {
      const lastNumericUserId = parseInt(lastUser.userId?.replace(/^0+/, "") || '0', 10);
      nextUserId = String(lastNumericUserId + 1).padStart(3, '0');
    } else {
      nextUserId = '001';
    }

    let newUser = new userModel({
      userId: nextUserId,
      issuer: user.issuer,
      email: userMetadata.email,
      lastLoginAt: user.claim.iat,
    });

    newUser.id = newUser._id;
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