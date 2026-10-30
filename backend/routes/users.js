const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log(`Запрос списка пользователей инициирован: ${req.user.login}`);

    const users = await User.findAll({ 
      attributes: ['id', 'login', 'name'], 
      raw: true 
    });

    res.json({
      message: "Список пользователей успешно получен",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера при получении пользователей" });
  }
});

module.exports = router;
