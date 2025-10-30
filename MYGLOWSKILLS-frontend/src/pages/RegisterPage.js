import React from "react";
import { motion } from "framer-motion";
import Register from "../components/Auth/Register";

const RegisterPage = () => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
    <Register />
  </motion.div>
);

export default RegisterPage;
