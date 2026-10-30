const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  },
  login: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
  }
});

const Category = sequelize.define("Category", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true,
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
  },
  color: { 
    type: DataTypes.STRING, 
    defaultValue: "#9CA3AF",
  }
});

const Expense = sequelize.define("Expense", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true, 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  },
  date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
  }
});

Category.hasMany(Expense, { foreignKey: 'category_id', onDelete: "CASCADE" });
Expense.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Expense, { foreignKey: 'user_id', onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Category, { foreignKey: 'user_id', onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Expense
};