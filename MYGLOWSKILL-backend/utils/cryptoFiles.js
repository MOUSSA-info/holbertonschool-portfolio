// utils/cryptoFiles.js
const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs').promises;

async function encryptFile(inPath, outPath, key) {
  const iv = crypto.randomBytes(16);
  const keyBuffer = crypto.createHash('sha256').update(key).digest(); // Derive 32-byte key
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  const input = fs.createReadStream(inPath);
  const output = fs.createWriteStream(outPath);
  output.write(iv);
  return new Promise((resolve, reject) => {
    input.pipe(cipher).pipe(output).on('finish', resolve).on('error', reject);
  });
}

async function decryptFile(inPath, outPath, key) {
  const keyBuffer = crypto.createHash('sha256').update(key).digest(); // Derive 32-byte key
  const fd = await fsPromises.open(inPath, 'r');
  const ivBuffer = Buffer.alloc(16);
  await fd.read(ivBuffer, 0, 16, 0);
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const input = fs.createReadStream(null, { fd: fd.fd, start: 16 });
  const output = fs.createWriteStream(outPath);
  return new Promise((resolve, reject) => {
    const cleanup = (err) => {
      fd.close().catch(() => {});
      reject(err);
    };
    input.on('error', cleanup);
    decipher.on('error', cleanup);
    output.on('error', cleanup);
    output.on('finish', () => {
      fd.close().catch(() => {});
      resolve();
    });
    input.pipe(decipher).pipe(output);
  });
}

module.exports = { encryptFile, decryptFile };
