import React from "react";

export default function FAQ() {
  const faqs = [
    { q: "Comment créer un compte ?", a: "Cliquez sur 'Register' et remplissez le formulaire." },
    { q: "Comment réinitialiser mon mot de passe ?", a: "Cliquez sur 'Login' puis 'Mot de passe oublié'." },
    { q: "Comment sécuriser mon compte ?", a: "Activez l'authentification à deux facteurs dans Paramètres." },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">❓ Foire aux questions</h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border-b pb-2">
            <p className="font-semibold">{f.q}</p>
            <p className="text-gray-700">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
