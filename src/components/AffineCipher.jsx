import { useState } from 'react';
import { affineEncrypt, affineDecrypt, VALID_A_VALUES } from '../utils/cryptoUtils';
import ResultBox from './ResultBox';

export default function AffineCipher() {
  const [text, setText] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const process = (mode) => {
    setError('');
    setResult('');
    try {
      if (!text.trim()) throw new Error('Teks tidak boleh kosong');
      if (a === '' || b === '') throw new Error('Kunci a dan b harus diisi');
      const out = mode === 'encrypt'
        ? affineEncrypt(text, Number(a), Number(b))
        : affineDecrypt(text, Number(a), Number(b));
      setResult(out);
    } catch (e) {
      setError(e.message);
    }
  };

  const clear = () => { setText(''); setA(''); setB(''); setResult(''); setError(''); };

  return (
    <>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon orange">📐</div>
          <div>
            <div className="card-title">Affine Cipher</div>
            <div className="card-subtitle">Substitusi linear dengan parameter a dan b</div>
          </div>
        </div>
        <span className="badge badge-orange">Monoalphabetic</span>
      </div>

      {/* Info Banner */}
      <div className="info-banner orange" style={{ marginTop: 16 }}>
        <span className="info-banner-icon">📌</span>
        <div>
          <div className="info-formula orange">
            <span className="lbl">Enkripsi: </span>
            <strong>E(x) = (a·x + b) mod 26</strong><br />
            <span className="lbl">Dekripsi: </span>
            <strong>D(x) = a⁻¹·(x − b) mod 26</strong>
          </div>
          <div className="info-note">
            Nilai a valid (coprime 26): {VALID_A_VALUES.join(', ')}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-body">
        <div className="form-row-2">
          {/* Input */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot orange" />
              Plainteks / Cipherteks
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Masukkan teks di sini..."
            />
          </div>

          {/* Output */}
          <ResultBox result={result} />
        </div>

        {/* Keys row */}
        <div className="form-row-2" style={{ maxWidth: 320, marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot orange" />
              Nilai a
            </label>
            <input
              type="number"
              value={a}
              onChange={e => setA(e.target.value)}
              placeholder="Misal: 5"
              min="1" max="25"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot orange" />
              Nilai b
            </label>
            <input
              type="number"
              value={b}
              onChange={e => setB(e.target.value)}
              placeholder="Misal: 8"
              min="0" max="25"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="btn-row">
          <button className="btn btn-orange" onClick={() => process('encrypt')}>
            🔒 Enkripsi
          </button>
          <button className="btn btn-green" onClick={() => process('decrypt')}>
            🔓 Dekripsi
          </button>
          <button className="btn btn-ghost" onClick={clear}>
            ✕ Bersihkan
          </button>
        </div>

        {error && (
          <div className="error-msg">
            ⚠️ {error}
          </div>
        )}
      </div>
    </>
  );
}