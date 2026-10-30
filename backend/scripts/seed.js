require('dotenv').config();

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize, User, Category, Expense } = require("../models");
const bcrypt = require("bcrypt");

const SEED_USER = {
  login: "admin",
  password: "12345",
  name: "Администратор"
};

const BASE_CATEGORIES = [
  { name: "Проезд", color: "#3B82F6" },
  { name: "Столовая", color: "#F59E0B" },
  { name: "Продукты", color: "#10B981" },
  { name: "Дом", color: "#EF4444" }
];

async function seedDatabase() {
  try {
    console.log("Запуск скрипта первоначального заполнения БД (Seeding)...");
    
    await sequelize.authenticate();

    let user = await User.findOne({ where: { login: SEED_USER.login } });

    if (!user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(SEED_USER.password, saltRounds);

      user = await User.create({
        login: SEED_USER.login,
        password: hashedPassword,
        name: SEED_USER.name
      });

      console.log(`Пользователь создан.`);
      console.log(`Используйте логин: "${SEED_USER.login}" и пароль: "${SEED_USER.password}" для входа.`);
    } else {
      console.log(`Пользователь "${SEED_USER.login}" уже существует.`);
    }

    let createdCategoriesCount = 0;

    for (const categoryData of BASE_CATEGORIES) {
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: { color: categoryData.color }
      });

      if (created) {
        createdCategoriesCount++;
      }
    }

    if (createdCategoriesCount > 0) {
      console.log(`Успешно добавлено новых категорий: ${createdCategoriesCount}.`);
    } else {
      console.log("Все базовые категории уже присутствуют в базе данных.");
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const transportCategory = await Category.findOne({ 
      where: { 
        name: "Проезд" 
      } 
    });
    const canteenCategory = await Category.findOne({ 
      where: { 
        name: "Столовая" 
      } 
    });

    const SEED_EXPENSES = [
      {
        title: "Поездка на метро на работу",
        amount: 55.00,
        date: yesterday,
        user_id: user.id,
        category_id: transportCategory.id
      },
      {
        title: "Бизнес-ланч с коллегами",
        amount: 450.00,
        date: yesterday,
        user_id: user.id,
        category_id: canteenCategory.id
      }
    ];

    let createdExpensesCount = 0;

    for (const expenseData of SEED_EXPENSES) {
      const [expense, created] = await Expense.findOrCreate({
        where: {
          title: expenseData.title,
          user_id: expenseData.user_id,
          date: expenseData.date
        },
        defaults: {
          amount: expenseData.amount,
          category_id: expenseData.category_id
        }
      });

      if (created) {
        createdExpensesCount++;
      }
    }

    if (createdExpensesCount > 0) {
      console.log(`Успешно добавлено новых расходов: ${createdExpensesCount}.`);
    } else {
      console.log("Вчерашние расходы уже присутствуют в базе данных.");
    }

    console.log("Процесс наполнения базы данных успешно завершен!");
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error.message);
  } finally {
    await sequelize.close();
    console.log("Соединение закрыто. Скрипт завершен.");
  }
}

seedDatabase();
