import { useState } from 'react';

export default function ResultBox({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="form-group">
      <div className="form-label">
        <span className="label-dot green" />
        Output
      </div>
      <div className="output-wrapper">
        <div className={`output-area ${result ? 'has-result' : ''}`}>
          {result
            ? result
            : <span className="output-placeholder">Hasil akan muncul di sini...</span>
          }
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Tersalin' : '📋 Salin'}
        </button>
      </div>
      {result && (
        <div className="output-char-count">
          {result.replace(/\s/g, '').length} karakter
        </div>
      )}
    </div>
  );
}