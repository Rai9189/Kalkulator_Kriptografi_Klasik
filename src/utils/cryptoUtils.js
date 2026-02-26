// ============================================
// UTILITY FUNCTIONS
// ============================================
export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function modInverse(a, m) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

// ============================================
// VIGENERE CIPHER
// ============================================
export function vigenereEncrypt(text, key) {
  if (!key.replace(/[^A-Za-z]/g, '')) throw new Error('Kunci harus berupa huruf alfabet');
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let ki = 0;
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const base = ch >= 'a' ? 97 : 65;
      const p = ch.charCodeAt(0) - base;
      const kv = k.charCodeAt(ki % k.length) - 65;
      result += String.fromCharCode(mod(p + kv, 26) + base);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function vigenereDecrypt(text, key) {
  if (!key.replace(/[^A-Za-z]/g, '')) throw new Error('Kunci harus berupa huruf alfabet');
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let ki = 0;
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const base = ch >= 'a' ? 97 : 65;
      const p = ch.charCodeAt(0) - base;
      const kv = k.charCodeAt(ki % k.length) - 65;
      result += String.fromCharCode(mod(p - kv, 26) + base);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}

// ============================================
// AFFINE CIPHER
// ============================================
export const VALID_A_VALUES = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

export function affineEncrypt(text, a, b) {
  if (!VALID_A_VALUES.includes(Number(a))) throw new Error(`Nilai a=${a} tidak valid. Harus coprime dengan 26.`);
  let result = '';
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const base = ch >= 'a' ? 97 : 65;
      const p = ch.charCodeAt(0) - base;
      result += String.fromCharCode(mod(a * p + Number(b), 26) + base);
    } else {
      result += ch;
    }
  }
  return result;
}

export function affineDecrypt(text, a, b) {
  if (!VALID_A_VALUES.includes(Number(a))) throw new Error(`Nilai a=${a} tidak valid. Harus coprime dengan 26.`);
  const aInv = modInverse(Number(a), 26);
  let result = '';
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const base = ch >= 'a' ? 97 : 65;
      const p = ch.charCodeAt(0) - base;
      result += String.fromCharCode(mod(aInv * (p - Number(b)), 26) + base);
    } else {
      result += ch;
    }
  }
  return result;
}

// ============================================
// PLAYFAIR CIPHER
// ============================================
export function playfairBuildMatrix(key) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const seen = new Set();
  const matrix = [];
  for (const ch of k + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
    if (!seen.has(ch)) { seen.add(ch); matrix.push(ch); }
  }
  return matrix;
}

function pfFindPos(matrix, ch) {
  const i = matrix.indexOf(ch === 'J' ? 'I' : ch);
  return [Math.floor(i / 5), i % 5];
}

export function playfairEncrypt(text, key) {
  const matrix = playfairBuildMatrix(key);
  let clean = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const pairs = [];
  let i = 0;
  while (i < clean.length) {
    let a = clean[i];
    let b = i + 1 < clean.length ? clean[i + 1] : 'X';
    if (a === b) { b = 'X'; i++; } else { i += 2; }
    pairs.push([a, b]);
  }
  let result = '';
  for (const [a, b] of pairs) {
    const [r1, c1] = pfFindPos(matrix, a);
    const [r2, c2] = pfFindPos(matrix, b);
    if (r1 === r2) {
      result += matrix[r1 * 5 + (c1 + 1) % 5] + matrix[r2 * 5 + (c2 + 1) % 5];
    } else if (c1 === c2) {
      result += matrix[((r1 + 1) % 5) * 5 + c1] + matrix[((r2 + 1) % 5) * 5 + c2];
    } else {
      result += matrix[r1 * 5 + c2] + matrix[r2 * 5 + c1];
    }
  }
  return result;
}

export function playfairDecrypt(text, key) {
  const matrix = playfairBuildMatrix(key);
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length % 2 !== 0) throw new Error('Cipherteks harus memiliki panjang genap');
  let result = '';
  for (let i = 0; i < clean.length; i += 2) {
    const [a, b] = [clean[i], clean[i + 1]];
    const [r1, c1] = pfFindPos(matrix, a);
    const [r2, c2] = pfFindPos(matrix, b);
    if (r1 === r2) {
      result += matrix[r1 * 5 + mod(c1 - 1, 5)] + matrix[r2 * 5 + mod(c2 - 1, 5)];
    } else if (c1 === c2) {
      result += matrix[mod(r1 - 1, 5) * 5 + c1] + matrix[mod(r2 - 1, 5) * 5 + c2];
    } else {
      result += matrix[r1 * 5 + c2] + matrix[r2 * 5 + c1];
    }
  }
  return result;
}

// ============================================
// HILL CIPHER
// ============================================
function matMul(A, v) {
  return A.map(row => mod(row.reduce((sum, val, j) => sum + val * v[j], 0), 26));
}

function detMod26(m) {
  const n = m.length;
  if (n === 2) return mod(m[0][0] * m[1][1] - m[0][1] * m[1][0], 26);
  let det = 0;
  for (let j = 0; j < 3; j++) {
    const rows = [1, 2];
    const cols = [0, 1, 2].filter(c => c !== j);
    const minor = [[m[rows[0]][cols[0]], m[rows[0]][cols[1]]], [m[rows[1]][cols[0]], m[rows[1]][cols[1]]]];
    const sign = j % 2 === 0 ? 1 : -1;
    det += sign * m[0][j] * (minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0]);
  }
  return mod(det, 26);
}

function adjugate(m) {
  const n = m.length;
  if (n === 2) return [[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]];
  const adj = [];
  for (let i = 0; i < 3; i++) {
    adj.push([]);
    for (let j = 0; j < 3; j++) {
      const rows = [0, 1, 2].filter(r => r !== j);
      const cols = [0, 1, 2].filter(c => c !== i);
      const minor = [[m[rows[0]][cols[0]], m[rows[0]][cols[1]]], [m[rows[1]][cols[0]], m[rows[1]][cols[1]]]];
      adj[i].push(((i + j) % 2 === 0 ? 1 : -1) * (minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0]));
    }
  }
  return adj;
}

export function hillInvertMatrix(m) {
  const det = detMod26(m);
  const detInv = modInverse(det, 26);
  if (detInv === null) return null;
  const adj = adjugate(m);
  return adj.map(row => row.map(v => mod(detInv * v, 26)));
}

export function hillEncrypt(text, keyMatrix) {
  const n = keyMatrix.length;
  let clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  while (clean.length % n !== 0) clean += 'X';
  let result = '';
  for (let i = 0; i < clean.length; i += n) {
    const block = Array.from({ length: n }, (_, j) => clean.charCodeAt(i + j) - 65);
    matMul(keyMatrix, block).forEach(v => result += String.fromCharCode(v + 65));
  }
  return result;
}

export function hillDecrypt(text, keyMatrix) {
  const inv = hillInvertMatrix(keyMatrix);
  if (!inv) throw new Error('Matriks tidak memiliki invers mod 26');
  return hillEncrypt(text, inv);
}

// ============================================
// ENIGMA CIPHER
// ============================================
const ENIGMA_ROTORS = [
  { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
];
const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

export function parsePlugboard(str) {
  const plug = {};
  const pairs = str.toUpperCase().replace(/[^A-Z ]/g, '').split(' ').filter(p => p.length === 2);
  for (const p of pairs) {
    if (p[0] !== p[1]) { plug[p[0]] = p[1]; plug[p[1]] = p[0]; }
  }
  return plug;
}

function enigmaStep(char, rotorIds, positions) {
  if (!/[A-Z]/.test(char)) return { char, positions };
  const pos = [...positions];

  // Turnover
  if (ENIGMA_ROTORS[rotorIds[2]].notch === String.fromCharCode(65 + pos[2])) pos[1] = mod(pos[1] + 1, 26);
  if (ENIGMA_ROTORS[rotorIds[1]].notch === String.fromCharCode(65 + pos[1])) {
    pos[0] = mod(pos[0] + 1, 26);
    pos[1] = mod(pos[1] + 1, 26);
  }
  pos[2] = mod(pos[2] + 1, 26);

  let c = char.charCodeAt(0) - 65;
  for (let i = 2; i >= 0; i--) {
    const idx = mod(c + pos[i], 26);
    c = mod(ENIGMA_ROTORS[rotorIds[i]].wiring.charCodeAt(idx) - 65 - pos[i], 26);
  }
  c = REFLECTOR.charCodeAt(c) - 65;
  for (let i = 0; i < 3; i++) {
    const shifted = mod(c + pos[i], 26);
    const back = ENIGMA_ROTORS[rotorIds[i]].wiring.indexOf(String.fromCharCode(65 + shifted));
    c = mod(back - pos[i], 26);
  }
  return { char: String.fromCharCode(65 + c), positions: pos };
}

export function enigmaProcess(text, rotorIds, startPositions, plugboard) {
  const plug = parsePlugboard(plugboard);
  let positions = [...startPositions];
  let result = '';
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      const plugged = plug[ch] || ch;
      const { char: enc, positions: newPos } = enigmaStep(plugged, rotorIds, positions);
      positions = newPos;
      result += plug[enc] || enc;
    } else {
      result += ch;
    }
  }
  return result;
}
