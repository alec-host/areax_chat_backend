const { Sequelize } = require("sequelize");

const sequelize1 = require("../db/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize1;

//-.database 1.
db.users = require("../models/user.model")(sequelize1,Sequelize);

module.exports = {db};

