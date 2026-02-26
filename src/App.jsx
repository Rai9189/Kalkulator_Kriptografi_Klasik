import { useState } from 'react';
import './App.css';
import VigenereCipher from './components/VigenereCipher';
import AffineCipher from './components/AffineCipher';
import PlayfairCipher from './components/PlayfairCipher';
import HillCipher from './components/HillCipher';
import EnigmaCipher from './components/EnigmaCipher';

const TABS = [
  {
    id: 'vigenere', label: 'Vigenere', icon: '🔑',
    color: 'blue',
    component: <VigenereCipher />,
  },
  {
    id: 'affine', label: 'Affine', icon: '📐',
    color: 'orange',
    component: <AffineCipher />,
  },
  {
    id: 'playfair', label: 'Playfair', icon: '🎯',
    color: 'green',
    component: <PlayfairCipher />,
  },
  {
    id: 'hill', label: 'Hill', icon: '📊',
    color: 'purple',
    component: <HillCipher />,
  },
  {
    id: 'enigma', label: 'Enigma', icon: '⚙️',
    color: 'rust',
    component: <EnigmaCipher />,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('vigenere');

  return (
    <div className="app-wrapper">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo-icon">🔐</div>
          <div>
            <div className="app-title">Kriptografi Klasik</div>
            <div className="app-subtitle">Kalkulator Enkripsi & Dekripsi — 5 Algoritma</div>
          </div>
        </div>
      </header>

      {/* ── ALGO TABS ── */}
      <div className="algo-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`algo-tab ${activeTab === tab.id ? `active ${tab.color}` : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-dot" />
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── PANEL ── */}
      {TABS.map(tab =>
        activeTab === tab.id && (
          <div key={tab.id} className="card">
            {tab.component}
          </div>
        )
      )}

    </div>
  );
}