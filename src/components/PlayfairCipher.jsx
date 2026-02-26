import { useState } from 'react';
import { playfairEncrypt, playfairDecrypt } from '../utils/cryptoUtils';
import ResultBox from './ResultBox';

export default function PlayfairCipher() {
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
        ? playfairEncrypt(text, key)
        : playfairDecrypt(text, key);
      setResult(out);
    } catch (e) {
      setError(e.message);
    }
  };

  const clear = () => { setText(''); setKey(''); setResult(''); setError(''); };

  return (
    <>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon green">🎯</div>
          <div>
            <div className="card-title">Playfair Cipher</div>
            <div className="card-subtitle">Enkripsi digraf menggunakan matriks 5×5</div>
          </div>
        </div>
        <span className="badge badge-green">Digraphic</span>
      </div>

      <div className="info-banner green" style={{ marginTop: 16 }}>
        <span className="info-banner-icon">📌</span>
        <div>
          <div className="info-formula green">
            Matriks 5×5 dibangun dari kunci kata (I/J digabung).<br />
            <strong>Aturan: Baris → geser kanan | Kolom → geser bawah | Persegi → tukar kolom</strong>
          </div>
          <div className="info-note">
            Huruf J diganti I. Jika digraf sama, sisipkan X. Teks dipecah jadi pasangan huruf.
          </div>
        </div>
      </div>

      <div className="form-body">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot green" />
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
            <span className="label-dot green" />
            Kata Kunci
          </label>
          <input
            type="text"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Contoh: MONARCHY"
          />
        </div>

        <div className="btn-row">
          <button className="btn btn-green" onClick={() => process('encrypt')}>
            🔒 Enkripsi
          </button>
          <button className="btn btn-primary" onClick={() => process('decrypt')}>
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