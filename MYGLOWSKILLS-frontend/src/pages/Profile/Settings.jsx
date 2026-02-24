import React, { useState } from "react";
import { updateProfile } from "../../services/api";
import "./Settings.css";

export default function Settings() {
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (!newUsername && !newPassword) {
      setError("Remplis au moins un champ à modifier.");
      return;
    }

    setLoading(true);
    try {
      const data = {};
      if (newUsername) data.newUsername = newUsername;
      if (newPassword) {
        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
      }

      await updateProfile(data);
      setMessage("✅ Profil mis à jour avec succès !");
      setNewUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Paramètres du compte</h1>
        <p>Modifie ton nom d'utilisateur ou ton mot de passe.</p>
      </div>

      <form className="settings-card" onSubmit={handleSave}>

        {/* Username */}
        <div className="settings-section">
          <h3>👤 Changer le nom d'utilisateur</h3>
          <div className="settings-field">
            <label>Nouveau nom d'utilisateur</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Laisse vide pour ne pas changer"
            />
          </div>
        </div>

        <div className="settings-divider" />

        {/* Password */}
        <div className="settings-section">
          <h3>🔒 Changer le mot de passe</h3>
          <div className="settings-field">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Requis pour changer le mot de passe"
            />
          </div>
          <div className="settings-field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Laisse vide pour ne pas changer"
            />
          </div>
          <div className="settings-field">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répète le nouveau mot de passe"
            />
          </div>
        </div>

        {message && <div className="settings-alert success">{message}</div>}
        {error && <div className="settings-alert error">{error}</div>}

        <button type="submit" className="settings-btn" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
