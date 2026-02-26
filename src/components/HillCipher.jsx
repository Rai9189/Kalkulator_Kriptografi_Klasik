import { useState } from 'react';
import { hillEncrypt, hillDecrypt } from '../utils/cryptoUtils';
import ResultBox from './ResultBox';

export default function HillCipher() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState([[3,3],[2,5]]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSizeChange = (n) => {
    setSize(n);
    if (n === 2) setMatrix([[3,3],[2,5]]);
    else setMatrix([[6,24,1],[13,16,10],[20,17,15]]);
    setResult('');
    setError('');
  };

  const handleCell = (i, j, val) => {
    const m = matrix.map(r => [...r]);
    m[i][j] = Number(val) || 0;
    setMatrix(m);
  };

  const process = (mode) => {
    setError('');
    setResult('');
    try {
      if (!text.trim()) throw new Error('Teks tidak boleh kosong');
      const out = mode === 'encrypt'
        ? hillEncrypt(text, matrix)
        : hillDecrypt(text, matrix);
      setResult(out);
    } catch (e) {
      setError(e.message);
    }
  };

  const clear = () => { setText(''); setResult(''); setError(''); };

  return (
    <>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon purple">📊</div>
          <div>
            <div className="card-title">Hill Cipher</div>
            <div className="card-subtitle">Enkripsi blok berbasis perkalian matriks mod 26</div>
          </div>
        </div>
        <span className="badge badge-purple">Linear Algebra</span>
      </div>

      <div className="info-banner purple" style={{ marginTop: 16 }}>
        <span className="info-banner-icon">📌</span>
        <div>
          <div className="info-formula purple">
            <span className="lbl">Enkripsi: </span><strong>C = K × P mod 26</strong><br />
            <span className="lbl">Dekripsi: </span><strong>P = K⁻¹ × C mod 26</strong>
          </div>
          <div className="info-note">
            det(K) harus coprime dengan 26. Padding 'X' jika teks kurang dari kelipatan ukuran blok.
          </div>
        </div>
      </div>

      <div className="form-body">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot purple" />
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

        {/* Matrix size */}
        <div className="form-group" style={{ maxWidth: 200, marginBottom: 14 }}>
          <label className="form-label">
            <span className="label-dot purple" />
            Ukuran Matriks
          </label>
          <select value={size} onChange={e => handleSizeChange(Number(e.target.value))}>
            <option value={2}>2 × 2</option>
            <option value={3}>3 × 3</option>
          </select>
        </div>

        {/* Matrix input */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">
            <span className="label-dot purple" />
            Matriks Kunci ({size}×{size})
          </label>
          <div className="matrix-wrap">
            <span className="matrix-bracket">[</span>
            <div
              className="matrix-inner"
              style={{ gridTemplateColumns: `repeat(${size}, 52px)` }}
            >
              {matrix.map((row, i) =>
                row.map((val, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    value={val}
                    onChange={e => handleCell(i, j, e.target.value)}
                    min="0" max="25"
                  />
                ))
              )}
            </div>
            <span className="matrix-bracket">]</span>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn btn-purple" onClick={() => process('encrypt')}>
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