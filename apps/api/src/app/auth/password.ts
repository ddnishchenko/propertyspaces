import { randomBytes, pbkdf2Sync } from 'crypto';
function saltPassword(password, salt) {
  const iterations = parseInt(process.env.SALT_ITRATION) || 1000;
  return pbkdf2Sync(password, salt, iterations, 64, `sha512`).toString(`hex`);
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');

  // Hashing user's salt and password with 1000 iterations,
  const hash = saltPassword(password, salt);
  return { salt, hash };
}

export function validatePassword(password, hash, salt) {
  return hash === saltPassword(password, salt);
}
