function generatePassword(length = 12) {
  const sets = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*()_+-=[]{}|;:,.<>?'
  ];

  // On prend au moins un caractère de chaque type
  let pwd = sets.map(set => set[Math.floor(Math.random() * set.length)]).join('');

  // Remplir le reste du mot de passe
  const all = sets.join('');
  while (pwd.length < length) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Mélanger les caractères pour plus d’aléatoire
  return pwd.split('').sort(() => 0.5 - Math.random()).join('').slice(0, length);
}

// Export
module.exports = generatePassword;
