import React, { useState } from "react";
import { motion } from "framer-motion";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Inscription réussie pour ${form.name}`);
  };

  return (
    <div className="page">
      <h1>Inscription ✨</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <motion.button className="button-primary" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          S’inscrire
        </motion.button>
      </form>
    </div>
  );
};

export default Register;
