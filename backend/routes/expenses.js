const express = require("express");
const router = express.Router();
const { Expense, Category } = require("../models");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { 
        user_id: req.user.id 
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name", "color"],
        }
      ],
      order: [["id"]],
      raw: false
    });

    res.json({
      message: "Список расходов успешно получен",
      data: expenses
    });
  } catch (err) {
    console.error("Ошибка при получении расходов:", err.message);
    res.status(500).json({ error: "Ошибка сервера при получении расходов" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, amount, date, category_id } = req.body;

    if (!amount || !category_id) {
      return res.status(400).json({ error: "Сумма и категория обязательны для заполнения" });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: "Указанная категория не найдена" });
    }

    const newExpense = await Expense.create({
      title,
      amount,
      date: date || new Date(),
      user_id: req.user.id,
      category_id
    });

    res.status(201).json({
      message: "Расход успешно добавлен",
      data: newExpense
    });
  } catch (err) {
    console.error("Ошибка при создании расхода:", err.message);
    res.status(400).json({ error: "Ошибка при добавлении расхода", details: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, category_id } = req.body;

    const expense = await Expense.findOne({
      where: { 
        id, user_id: req.user.id 
      }
    });

    if (!expense) {
      return res.status(404).json({ error: "Расход не найден" });
    }

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ error: "Указанная категория не найдена" });
      }
      expense.category_id = category_id;
    }

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;

    await expense.save();

    res.json({
      message: "Расход успешно обновлен",
      data: expense
    });
  } catch (err) {
    console.error("Ошибка при обновлении расхода:", err.message);
    res.status(500).json({ error: "Ошибка сервера при обновлении расхода" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Expense.destroy({
      where: { 
        id, 
        user_id: req.user.id 
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Расход не найден или доступ запрещен" });
    }

    res.json({
      message: "Расход успешно удален"
    });
  } catch (err) {
    console.error("Ошибка при удалении расхода:", err.message);
    res.status(500).json({ error: "Ошибка сервера при удалении расхода" });
  }
});

module.exports = router;
