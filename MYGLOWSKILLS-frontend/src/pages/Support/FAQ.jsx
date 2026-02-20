import React, { useState } from "react";
import "./Support.css";

const faqs = [
  { q: "Comment créer un compte ?", a: "Clique sur 'Inscription' dans le menu et remplis le formulaire avec ton nom d'utilisateur et mot de passe." },
  { q: "Comment réinitialiser mon mot de passe ?", a: "Va dans Paramètres > Sécurité et clique sur 'Changer le mot de passe'." },
  { q: "Comment sécuriser mon compte ?", a: "Active l'authentification à deux facteurs dans Paramètres et utilise un mot de passe fort." },
  { q: "Comment chiffrer un fichier ?", a: "Va dans Sécurité > Chiffrer un fichier, sélectionne ton fichier et clique sur Chiffrer." },
  { q: "Comment contacter le support ?", a: "Utilise le formulaire de contact dans Support > Contact technique." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="support-page">
      <div className="support-header">
        <h1>❓ Foire aux questions</h1>
        <p>Retrouve les réponses aux questions les plus fréquentes.</p>
      </div>

      <div className="support-card faq-card">
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{f.q}</span>
              <span className="faq-icon">{openIndex === i ? "▲" : "▼"}</span>
            </button>
            {openIndex === i && (
              <div className="faq-answer">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
