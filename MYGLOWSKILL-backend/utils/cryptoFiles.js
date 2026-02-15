// utils/cryptoFiles.js
const crypto = require('crypto');
const fs = require('fs');


async function encryptFile(inPath, outPath, key) {
  const iv = crypto.randomBytes(16);
  const keyBuffer = crypto.createHash('sha256').update(key).digest(); // Derive 32-byte key
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  const input = fs.createReadStream(inPath);
  const output = fs.createWriteStream(outPath);
  output.write(iv);
  return new Promise((resolve, reject) => {
    input.on('error', reject);
    cipher.on('error', reject);
    output.on('error', reject);
    output.on('finish', resolve);
    input.pipe(cipher).pipe(output);
  });
}

module.exports = { encryptFile };
