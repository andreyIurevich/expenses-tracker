const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/register", async (req, res) => {
  try {
    const { login, password, name } = req.body;
    
    const candidate = await User.findOne({ where: { login } });
    if (candidate) {
      return res.status(400).json({ error: "Пользователь с таким логином уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ login, password: hashedPassword, name });
    
    res.status(201).json({
      message: "Пользователь успешно создан",
      user: { id: newUser.id, login: newUser.login, name: newUser.name }
    });
  } catch (err) {
    res.status(400).json({ error: "Ошибка при регистрации", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      { id: user.id, login: user.login, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    /*
    res.json({
      message: "Успешный вход",
      token: token,
      user: { id: user.id, name: user.name, login: user.login }
    });
    */
    res.status(500).json({ error: "Ошибка сервера" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
