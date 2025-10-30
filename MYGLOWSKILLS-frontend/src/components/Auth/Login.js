import React, { useState } from "react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Connexion avec ${email}`);
  };

  return (
    <div className="page">
      <h1>Connexion 🔐</h1>
      <form className="form" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <motion.button className="button-primary" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          Se connecter
        </motion.button>
      </form>
    </div>
  );
};

export default Login;
