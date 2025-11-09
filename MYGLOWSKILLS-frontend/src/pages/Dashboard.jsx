import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord MyGlowSkills</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sécurité */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Sécurité</h2>
            <p>Données sauvegardées: 120MB</p>
            <p>Alertes: 3</p>
            <p>Dernière vérification: 09/11/2025</p>
            <div className="mt-4 flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Analyser</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Exporter</button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">Configurer</button>
            </div>
          </div>

          {/* Outils */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Outils</h2>
            <ul className="list-disc ml-5">
              <li>Analyse des vulnérabilités</li>
              <li>Téléversement fichiers à chiffrer</li>
              <li>Sauvegarde sécurisée</li>
              <li>Générateur de mot de passe</li>
            </ul>
          </div>

          {/* Profil */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Profil & Paramètres</h2>
            <ul className="list-disc ml-5">
              <li>Modifier infos du compte</li>
              <li>Gérer les autorisations</li>
              <li>Choisir niveau de sécurité</li>
            </ul>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Support & Aide</h2>
          <ul className="list-disc ml-5">
            <li>Formulaire de contact technique</li>
            <li>FAQ</li>
            <li>Guide d'utilisation</li>
            <li>Mentions légales & politique de confidentialité</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
