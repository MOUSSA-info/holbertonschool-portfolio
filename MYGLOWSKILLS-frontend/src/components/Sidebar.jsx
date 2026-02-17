import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className="hover:bg-gray-200 p-2 rounded">Dashboard</Link>

        <h3 className="font-semibold mt-4">Sécurité</h3>
        <Link to="/security/overview" className="hover:bg-gray-200 p-2 rounded">Vue d'ensemble</Link>
        <Link to="/security/analyze" className="hover:bg-gray-200 p-2 rounded">Analyse</Link>
        <Link to="/security/encrypt" className="hover:bg-gray-200 p-2 rounded">Chiffrer fichier</Link>
        <Link to="/security/backup" className="hover:bg-gray-200 p-2 rounded">Backup</Link>
        <Link to="/security/backups" className="hover:bg-gray-200 p-2 rounded">Mes Fichiers</Link>
        <Link to="/security/password-generator" className="hover:bg-gray-200 p-2 rounded">Générateur mot de passe</Link>

        <h3 className="font-semibold mt-4">Profil</h3>
        <Link to="/profile/settings" className="hover:bg-gray-200 p-2 rounded">Paramètres</Link>
        <Link to="/profile/roles" className="hover:bg-gray-200 p-2 rounded">Rôles</Link>

        <h3 className="font-semibold mt-4">Support</h3>
        <Link to="/support/contact" className="hover:bg-gray-200 p-2 rounded">Contact</Link>
        <Link to="/support/faq" className="hover:bg-gray-200 p-2 rounded">FAQ</Link>
        <Link to="/support/guide" className="hover:bg-gray-200 p-2 rounded">Guide</Link>

        <h3 className="font-semibold mt-4">Legal</h3>
        <Link to="/legal" className="hover:bg-gray-200 p-2 rounded">Mentions légales</Link>
      </nav>
    </aside>
  );
}
