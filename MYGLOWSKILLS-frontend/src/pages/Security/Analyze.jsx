import React, { useState } from "react";
import { analyzeSecurity } from "../../services/api";
import "./Analyze.css";

const severityConfig = {
  critical: { label: 'Critique', color: '#ef4444', bg: '#fef2f2', icon: '🔴' },
  warning:  { label: 'Attention', color: '#f0a500', bg: '#fffbeb', icon: '🟡' },
  info:     { label: 'Info',     color: '#3b82f6', bg: '#eff6ff', icon: '🔵' },
};

function ScoreGauge({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f0a500' : '#ef4444';
  const label = score >= 80 ? 'Bon' : score >= 50 ? 'Moyen' : 'Critique';
  return (
    <div className="score-gauge">
      <svg viewBox="0 0 120 80" width="180">
        <path d="M10,70 A50,50 0 0,1 110,70" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M10,70 A50,50 0 0,1 110,70"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 157} 157`}
        />
      </svg>
      <div className="score-value" style={{ color }}>{score}</div>
      <div className="score-label" style={{ color }}>{label}</div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Analyze() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await analyzeSecurity();
      setReport(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyze-page">
      <div className="analyze-header">
        <h1>🔍 Analyse de sécurité</h1>
        <p>Lance une analyse complète pour détecter les failles et obtenir des recommandations.</p>
      </div>

      <div className="analyze-launch">
        <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
          {loading ? (
            <><span className="spinner" /> Analyse en cours...</>
          ) : (
            '🚀 Lancer l\'analyse'
          )}
        </button>
      </div>

      {error && <div className="analyze-alert error">{error}</div>}

      {report && (
        <div className="analyze-results">

          {/* Score */}
          <div className="analyze-card score-card">
            <ScoreGauge score={report.score} />
            <div className="score-meta">
              <h3>Score de sécurité</h3>
              <p>{report.issuesFound === 0 ? '✅ Aucun problème détecté !' : `${report.issuesFound} problème${report.issuesFound > 1 ? 's' : ''} détecté${report.issuesFound > 1 ? 's' : ''}`}</p>
              <span className="score-date">Analysé le {new Date(report.generatedAt).toLocaleString('fr-FR')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="analyze-stats">
            <div className="analyze-stat">
              <span className="stat-num">{report.stats.backupCount}</span>
              <span className="stat-lbl">Fichiers sauvegardés</span>
            </div>
            <div className="analyze-stat">
              <span className="stat-num">{report.stats.encryptedCount}</span>
              <span className="stat-lbl">Fichiers chiffrés</span>
            </div>
            <div className="analyze-stat">
              <span className="stat-num">{formatBytes(report.stats.totalSizeBytes)}</span>
              <span className="stat-lbl">Stockage utilisé</span>
            </div>
          </div>

          {/* Issues */}
          {report.details.length > 0 ? (
            <div className="analyze-card">
              <h3>⚠️ Problèmes détectés</h3>
              <div className="issues-list">
                {report.details.map((d) => {
                  const cfg = severityConfig[d.severity];
                  return (
                    <div key={d.id} className="issue-item" style={{ background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
                      <div className="issue-top">
                        <span className="issue-icon">{cfg.icon}</span>
                        <span className="issue-category">{d.category}</span>
                        <span className="issue-badge" style={{ background: cfg.color }}>{cfg.label}</span>
                      </div>
                      <p className="issue-msg">{d.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="analyze-card success-card">
              <div className="success-icon">🛡️</div>
              <h3>Tout est en ordre !</h3>
              <p>Aucun problème de sécurité détecté. Continue comme ça.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
