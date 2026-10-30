const express = require("express");
const router = express.Router();
const { Category } = require("../models");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log(`Пользователь ${req.user.login} запросил список категорий`);

    const categories = await Category.findAll({
      attributes: ["id", "name", "color"],
      order: [["name", "ASC"]],
      raw: true
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error("Ошибка при получении категорий:", err.message);
    res.status(500).json({
        success: true, 
        error: "Ошибка сервера при получении категорий" 
    });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Категория не найдена" });
    }

    if (name && name !== category.name) {
      const duplicate = await Category.findOne({ where: { name } });
      if (duplicate) {
        return res.status(400).json({ error: "Категория с таким названием уже существует" });
      }
    }

    if (name) category.name = name;
    if (color) category.color = color;

    await category.save();

    res.json({
      message: "Категория успешно обновлена",
      data: category
    });
  } catch (err) {
    console.error("Ошибка при обновлении категории:", err.message);
    res.status(500).json({ error: "Ошибка сервера при обновлении категории" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Category.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Категория не найдена" });
    }

    res.json({
      message: "Категория успешно удалена"
    });
  } catch (err) {
    console.error("Ошибка при удалении категории:", err.message);
    res.status(500).json({ error: "Ошибка сервера при удалении категории" });
  }
});

module.exports = router;
