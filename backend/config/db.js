const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: true
  },
});

module.exports = sequelize;
