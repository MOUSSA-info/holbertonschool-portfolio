import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div className="page" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <h1>Bienvenue sur MyGlowSkill 🌟</h1>
      <p>Apprends, progresse et brille dans ton domaine.</p>
      <Link to="/register">
        <motion.button className="button-primary" whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}>
          Commencer maintenant
        </motion.button>
      </Link>
    </motion.div>
  );
}

export default Home;
