import { useState } from 'react';
import { vigenereEncrypt, vigenereDecrypt } from '../utils/cryptoUtils';
import ResultBox from './ResultBox';

export default function VigenereCipher() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const process = (mode) => {
    setError('');
    setResult('');
    try {
      if (!text.trim()) throw new Error('Teks tidak boleh kosong');
      if (!key.trim()) throw new Error('Kunci tidak boleh kosong');
      const out = mode === 'encrypt'
        ? vigenereEncrypt(text, key)
        : vigenereDecrypt(text, key);
      setResult(out);
    } catch (e) {
      setError(e.message);
    }
  };

  const clear = () => { setText(''); setKey(''); setResult(''); setError(''); };

  return (
    <>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon blue">🔑</div>
          <div>
            <div className="card-title">Vigenere Cipher</div>
            <div className="card-subtitle">Substitusi polialfabetik dengan kunci kata</div>
          </div>
        </div>
        <span className="badge badge-blue">Polyalphabetic</span>
      </div>

      {/* Info Banner */}
      <div className="info-banner" style={{ marginTop: 16 }}>
        <span className="info-banner-icon">📌</span>
        <div>
          <div className="info-formula">
            <span className="lbl">Enkripsi: </span>
            <strong>Ci = (Pi + Ki) mod 26</strong><br />
            <span className="lbl">Dekripsi: </span>
            <strong>Pi = (Ci − Ki + 26) mod 26</strong>
          </div>
          <div className="info-note">
            Kunci diulang sepanjang plainteks. Hanya huruf A–Z yang diproses.
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-body">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot" />
              Plainteks / Cipherteks
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Masukkan teks di sini..."
            />
          </div>
          <ResultBox result={result} />
        </div>

        <div className="form-group" style={{ maxWidth: 320, marginBottom: 14 }}>
          <label className="form-label">
            <span className="label-dot" />
            Kata Kunci
          </label>
          <input
            type="text"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Contoh: SECRET"
          />
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => process('encrypt')}>
            🔒 Enkripsi
          </button>
          <button className="btn btn-green" onClick={() => process('decrypt')}>
            🔓 Dekripsi
          </button>
          <button className="btn btn-ghost" onClick={clear}>
            ✕ Bersihkan
          </button>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}
      </div>
    </>
  );
}