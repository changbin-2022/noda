const Sequelize = require('sequelize');

const sequelize = new Sequelize('ExchangeRate', 'sa', '12345', { // 1: 'name', 2: 'user', 3: 'password'
    dialect: 'mssql',
    host: 'localhost'
});

module.exports = sequelize;