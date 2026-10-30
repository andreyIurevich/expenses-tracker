require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { sequelize, User, Category, Expense } = require("./models");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:5173"
  ], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

sequelize.sync({ alter: true })
  .then(async () => {
    console.log("Успешное подключение к PostgreSQL и синхронизация моделей пройдены!");

    try {
      const users = await User.findAll({ 
        attributes: ['id', 'login', 'name'], 
        raw: true 
      });
      console.log("=== СПИСОК ПОЛЬЗОВАТЕЛЕЙ В БАЗЕ ДАННЫХ ===");
      if (users.length === 0) {
        console.log("В базе пока нет пользователей. Таблица пуста.");
      } else {
        console.table(users);
      }
      console.log("==========================================");
    } catch (dbErr) {
      console.error("Не удалось прочитать список пользователей:", dbErr.message);
    }

    try {
      const categories = await Category.findAll({ 
        attributes: ['id', 'name', 'color'], 
        raw: true 
      });
      console.log("=== СПИСОК КАТЕГОРИЙ В БАЗЕ ДАННЫХ ===");
      if (categories.length === 0) {
        console.log("В базе пока нет категорий. Таблица пуста.");
      } else {
        console.table(categories);
      }
      console.log("==========================================");
    } catch (dbErr) {
      console.error("Не удалось прочитать список категорий:", dbErr.message);
    }

    try {
      const expenses = await Expense.findAll({ 
        attributes: ['id', 'title', 'amount', 'date'], 
        raw: true 
      });
      console.log("=== СПИСОК РАСХОДОВ В БАЗЕ ДАННЫХ ===");
      if (expenses.length === 0) {
        console.log("В базе пока нет расходов. Таблица пуста.");
      } else {
        console.table(expenses);
      }
      console.log("==========================================");
    } catch (dbErr) {
      console.error("Не удалось прочитать список расходов:", dbErr.message);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}. Готов к работе.`);
    });
  })
  .catch(err => console.error("Критическая ошибка при подключении к базе данных:", err));