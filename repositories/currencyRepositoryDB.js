const { pool } = require('../db')
const Currency = require('../models/currency');
const ExchangeRate = require('../models/exchangeRate');

class CurrencyRepositoryDB {
    async getAllCurrencies() {
        const [rows] = await pool.query('SELECT * FROM Currencies');
        return rows.map(row => new Currency(row.id, row.name, row.code));
    }
}