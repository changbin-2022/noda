const Sequelize = require('sequelize');
const sequelize = require('../dbSequelize');

const Currency = sequelize.define('currency', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    code: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
}, {
        tableName: 'Currencies',
        timestamps: false
});

const ExchangeRate = sequelize.define('exchangeRate', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    currencyId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    buy: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    sell: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
}, {
        tableName: 'ExchangeRates',
        timestamps: false
});

//багато до одного
ExchangeRate.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency'            
});

//один до багатьох
Currency.hasMany(ExchangeRate, {
  foreignKey: 'currencyId',
  as: 'exchangeRates'      
});

module.exports = { Currency, ExchangeRate };

