const { Magic } = require('@magic-sdk/admin');

module.exports = new Magic(process.env.MAGIC_SECRET);
