// utils/passwordGen.js
function generatePassword(length = 12) {
  const sets = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*()_+-=[]{}|;:,.<>?'
  ];
  let all = sets.join('');
  let pwd = sets.map(s => s[Math.floor(Math.random() * s.length)]).join('');
  while (pwd.length < length) pwd += all[Math.floor(Math.random() * all.length)];
  return pwd.split('').sort(() => 0.5 - Math.random()).join('').slice(0, length);
}

module.exports = { generatePassword };
