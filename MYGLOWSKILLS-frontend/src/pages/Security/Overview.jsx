import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOverview, analyzeSecurity } from "../../services/api";
import "./Overview.css";

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f0a500' : '#ef4444';
  const label = score >= 80 ? 'Bon' : score >= 50 ? 'Moyen' : 'Critique';
  return (
    <div className="score-badge" style={{ borderColor: color }}>
      <span className="score-num" style={{ color }}>{score}</span>
      <span className="score-lbl" style={{ color }}>{label}</span>
    </div>
  );
}

const severityConfig = {
  critical: { label: 'Critique', color: '#ef4444', bg: '#fef2f2', icon: '🔴' },
  warning:  { label: 'Attention', color: '#f0a500', bg: '#fffbeb', icon: '🟡' },
  info:     { label: 'Info',     color: '#3b82f6', bg: '#eff6ff', icon: '🔵' },
};

export default function Overview() {
  const [overview, setOverview] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ovRes, anRes] = await Promise.all([
          getOverview(),
          analyzeSecurity(),
        ]);
        setOverview(ovRes.data.data);
        setReport(anRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="overview-page">
        <div className="overview-loading">
          <div className="ov-spinner" />
          <p>Chargement de la vue d'ensemble...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-page">
      <div className="overview-header">
        <h1>📊 Vue d'ensemble</h1>
        <p>Résumé en temps réel de ta sécurité.</p>
      </div>

      {/* Score + Stats */}
      <div className="overview-top">
        {report && (
          <div className="ov-card score-section">
            <ScoreBadge score={report.score} />
            <div className="score-info">
              <h3>Score de sécurité</h3>
              <p>{report.issuesFound === 0
                ? '✅ Aucun problème détecté'
                : `${report.issuesFound} problème${report.issuesFound > 1 ? 's' : ''} détecté${report.issuesFound > 1 ? 's' : ''}`}
              </p>
              <Link to="/security/analyze" className="ov-link">Voir l'analyse complète →</Link>
            </div>
          </div>
        )}

        {overview && (
          <div className="ov-stats">
            <div className="ov-stat">
              <span className="ov-stat-icon">💾</span>
              <span className="ov-stat-val">{formatBytes(overview.savedDataBytes)}</span>
              <span className="ov-stat-lbl">Données sauvegardées</span>
            </div>
            <div className="ov-stat">
              <span className="ov-stat-icon">🔒</span>
              <span className="ov-stat-val">{overview.alertsCount}</span>
              <span className="ov-stat-lbl">Fichiers chiffrés</span>
            </div>
            <div className="ov-stat">
              <span className="ov-stat-icon">📁</span>
              <span className="ov-stat-val">{overview.backupCount}</span>
              <span className="ov-stat-lbl">Fichiers sauvegardés</span>
            </div>
            <div className="ov-stat">
              <span className="ov-stat-icon">🕐</span>
              <span className="ov-stat-val">{new Date(overview.lastCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="ov-stat-lbl">Dernière vérif.</span>
            </div>
          </div>
        )}
      </div>

      {/* Problèmes */}
      {report && report.details.length > 0 && (
        <div className="ov-card">
          <div className="ov-card-header">
            <h3>⚠️ Problèmes détectés</h3>
            <Link to="/security/analyze" className="ov-link">Analyse complète →</Link>
          </div>
          <div className="ov-issues">
            {report.details.map((d) => {
              const cfg = severityConfig[d.severity];
              return (
                <div key={d.id} className="ov-issue" style={{ background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
                  <span>{cfg.icon}</span>
                  <div>
                    <strong style={{ color: cfg.color }}>{d.category}</strong>
                    <p>{d.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {report && report.details.length === 0 && (
        <div className="ov-card ov-success">
          <span>🛡️</span>
          <div>
            <strong>Tout est en ordre !</strong>
            <p>Aucun problème de sécurité détecté.</p>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="ov-card">
        <h3>⚡ Actions rapides</h3>
        <div className="ov-actions">
          <Link to="/security/analyze" className="ov-action-btn">🔍 Lancer une analyse</Link>
          <Link to="/security/backup" className="ov-action-btn">💾 Sauvegarder</Link>
          <Link to="/security/encrypt" className="ov-action-btn">🔒 Chiffrer un fichier</Link>
          <Link to="/security/password-generator" className="ov-action-btn">🔑 Générateur mdp</Link>
        </div>
      </div>
    </div>
  );
}
