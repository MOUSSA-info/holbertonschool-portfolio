import React, { useState } from "react";
import { sendContactMessage } from "../../services/api";
import "./Support.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactMessage({ name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h1>📩 Contact technique</h1>
        <p>Une question ou un problème ? Envoie-nous un message.</p>
      </div>

      <div className="support-card contact-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton nom"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décris ton problème..."
              rows="5"
              required
            />
          </div>

          <button type="submit" className="support-btn" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer le message"}
          </button>
        </form>

        {status === "success" && (
          <div className="support-alert success">✅ Message envoyé avec succès !</div>
        )}
        {status === "error" && (
          <div className="support-alert error">❌ Erreur lors de l'envoi. Réessaie.</div>
        )}
      </div>
    </div>
  );
}
