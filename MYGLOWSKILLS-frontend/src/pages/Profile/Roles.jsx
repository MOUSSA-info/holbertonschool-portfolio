import React, { useState } from "react";

export default function Roles() {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "Utilisateur" },
  ]);

  const changeRole = (id, newRole) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">👥 Gestion des rôles</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Nom</th>
            <th className="border px-4 py-2 text-left">Rôle</th>
            <th className="border px-4 py-2 text-left">Modifier</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Admin</option>
                  <option>Utilisateur</option>
                  <option>Invité</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
