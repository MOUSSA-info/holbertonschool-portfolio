const User = require("../models/User");
const tokenService = require("../services/tokenService");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ email, password });
    await user.save();

    const token = tokenService.generateToken(user);
    res.status(201).json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = tokenService.generateToken(user);
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
