// const ImageKit = require("@imagekit/nodejs");

// const imagekit = new ImageKit({
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
// });

// module.exports = imagekit;
const ImageKit = require("@imagekit/nodejs");

console.log(
  "ImageKit private key loaded:",
  !!process.env.IMAGEKIT_PRIVATE_KEY
);

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

module.exports = imagekit;