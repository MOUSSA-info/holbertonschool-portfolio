// utils/cryptoFiles.js
const crypto = require('crypto');
const fs = require('fs');

async function encryptFile(inPath, outPath, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf8').slice(0, 32), iv);
  const input = fs.createReadStream(inPath);
  const output = fs.createWriteStream(outPath);
  output.write(iv);
  return new Promise((resolve, reject) => {
    input.pipe(cipher).pipe(output).on('finish', resolve).on('error', reject);
  });
}

module.exports = { encryptFile };
