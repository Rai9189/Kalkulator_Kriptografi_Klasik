import { useState } from 'react';
import { enigmaProcess } from '../utils/cryptoUtils';
import ResultBox from './ResultBox';

const ROTOR_TYPES = ['I', 'II', 'III', 'IV', 'V'];

export default function EnigmaCipher() {
  const [text, setText] = useState('');
  const [rotors, setRotors] = useState([
    { type: 0, position: 'A', ringstellung: 'A' },
    { type: 1, position: 'A', ringstellung: 'A' },
    { type: 2, position: 'A', ringstellung: 'A' },
  ]);
  const [plugboard, setPlugboard] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const updateRotor = (i, field, val) => {
    const r = rotors.map(x => ({ ...x }));
    if (field === 'type') {
      r[i].type = Number(val);
    } else {
      r[i][field] = val.toUpperCase().slice(0, 1) || 'A';
    }
    setRotors(r);
  };

  const process = () => {
    setError('');
    setResult('');
    try {
      if (!text.trim()) throw new Error('Teks tidak boleh kosong');
      const rotorIds       = rotors.map(r => r.type);
      const startPositions = rotors.map(r => r.position.charCodeAt(0) - 65);
      // FIX: kirim ringSettings ke enigmaProcess
      const ringSettings   = rotors.map(r => r.ringstellung.charCodeAt(0) - 65);
      const out = enigmaProcess(text, rotorIds, startPositions, plugboard, ringSettings);
      setResult(out);
    } catch (e) {
      setError(e.message);
    }
  };

  const clear = () => { setText(''); setPlugboard(''); setResult(''); setError(''); };

  return (
    <>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon rust">⚙️</div>
          <div>
            <div className="card-title">Enigma Machine</div>
            <div className="card-subtitle">Simulasi mesin enkripsi Enigma WWII</div>
          </div>
        </div>
        <span className="badge badge-rust">Rotor Machine</span>
      </div>

      <div className="info-banner rust" style={{ marginTop: 16 }}>
        <span className="info-banner-icon">📌</span>
        <div>
          <div className="info-formula rust">
            Tiga rotor (I–V) + Reflektor B.<br />
            <strong>Enkripsi = Dekripsi (dengan seting rotor yang sama)</strong>
          </div>
          <div className="info-note">
            Set posisi awal rotor (A–Z) dan ring setting. Plugboard opsional: pasangan huruf dipisah spasi, mis: AB CD EF.
          </div>
        </div>
      </div>

      <div className="form-body">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              <span className="label-dot rust" />
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

        <div className="section-divider">
          <span>Konfigurasi Rotor</span>
        </div>

        <div className="rotor-row">
          {rotors.map((rotor, i) => (
            <div className="rotor-card" key={i}>
              <div className="rotor-card-title">Rotor {i + 1}</div>
              <div className="form-group">
                <label className="form-label">Tipe</label>
                <select
                  value={rotor.type}
                  onChange={e => updateRotor(i, 'type', e.target.value)}
                >
                  {ROTOR_TYPES.map((label, idx) => (
                    <option key={idx} value={idx}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Posisi</label>
                <input
                  type="text"
                  value={rotor.position}
                  onChange={e => updateRotor(i, 'position', e.target.value)}
                  maxLength={1}
                  style={{ textAlign: 'center', textTransform: 'uppercase' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ring</label>
                <input
                  type="text"
                  value={rotor.ringstellung}
                  onChange={e => updateRotor(i, 'ringstellung', e.target.value)}
                  maxLength={1}
                  style={{ textAlign: 'center', textTransform: 'uppercase' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">
            <span className="label-dot rust" />
            Plugboard (opsional)
          </label>
          <input
            type="text"
            value={plugboard}
            onChange={e => setPlugboard(e.target.value)}
            placeholder="Contoh: AB CD EF GH"
          />
        </div>

        <div className="btn-row">
          <button className="btn btn-rust" onClick={process}>
            ⚙️ Proses (Enkripsi = Dekripsi)
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