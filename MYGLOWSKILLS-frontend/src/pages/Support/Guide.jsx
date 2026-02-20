import React from "react";
import "./Support.css";

const steps = [
  { icon: "🏠", title: "Tableau de bord", desc: "Accède à ton tableau de bord pour voir les alertes de sécurité et les statistiques en temps réel." },
  { icon: "🔍", title: "Analyser", desc: "Analyse tes données pour détecter les vulnérabilités et les menaces potentielles." },
  { icon: "🔒", title: "Chiffrer", desc: "Chiffre tes fichiers sensibles pour les protéger contre tout accès non autorisé." },
  { icon: "💾", title: "Sauvegarder", desc: "Crée des sauvegardes de tes fichiers importants et accède-y à tout moment." },
  { icon: "👤", title: "Gérer ton compte", desc: "Modifie tes informations personnelles et gère les rôles des utilisateurs dans Paramètres." },
  { icon: "🆘", title: "Support", desc: "Consulte la FAQ ou contacte notre équipe technique pour toute assistance." },
];

export default function Guide() {
  return (
    <div className="support-page">
      <div className="support-header">
        <h1>📖 Guide d'utilisation</h1>
        <p>Découvre comment utiliser toutes les fonctionnalités de MyGlowSkills.</p>
      </div>

      <div className="guide-grid">
        {steps.map((s, i) => (
          <div key={i} className="guide-step">
            <div className="guide-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
