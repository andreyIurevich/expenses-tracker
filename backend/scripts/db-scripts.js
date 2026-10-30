require('dotenv').config();

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize, User } = require("../models");

const LOGINS_TO_DELETE = ["admin"]; 

async function runScript() {
  try {
    console.log("Запуск скрипта очистки базы данных...");
    
    await sequelize.authenticate();
    
    for (const login of LOGINS_TO_DELETE) {
      const deletedCount = await User.destroy({
        where: { login: login }
      });

      if (deletedCount > 0) {
        console.log(`Пользователь с логином "${login}" успешно удален.`);
      } else {
        console.log(`Пользователь с логином "${login}" не найден в базе данных.`);
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнении скрипта:", error.message);
  } finally {
    await sequelize.close();
    console.log("Соединение с базой данных закрыто. Скрипт завершен.");
  }
}

runScript();
