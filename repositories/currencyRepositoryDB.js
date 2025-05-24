const { getPool } = require("../db");
const sql = require("mssql");
const Currency = require("../models/currency");
const ExchangeRate = require("../models/exchangeRate");

class CurrencyRepositoryDB {
  // отримати всі валюти з бази
  async getAllCurrencies() {
    const pool = getPool();
    try {
      const result = await pool.request().query("SELECT * FROM Currencies");
      return result.recordset.map(c => new Currency(c.id, c.name, c.code));
    } catch (error) {
      console.error("Error getting all currencies: ", error);
      return [];
    }
  }

  // отримати всі курси валют з бази
  async getAllExchangeRates() {
    const pool = getPool();
    try {
      const result = await pool.request().query("SELECT * FROM ExchangeRates");
      return result.recordset.map(r => new ExchangeRate(r.currencyId, r.date, r.buy, r.sell));
    } catch (error) {
      console.error("Error getting all exchange rates: ", error);
      return [];
    }
  }

  // додати нову валюту (транзакційно)
  async addCurrency(name, code) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      const checkCode = await request
        .input("code", sql.VarChar(10), code)
        .query("SELECT * FROM Currencies WHERE code = @code");

      if (checkCode.recordset.length > 0) {
        throw new Error(`Currency with code "${code}" already exists.`);
      }

      const idRequest = new sql.Request(transaction);
      const maxIdResult = await idRequest.query("SELECT MAX(id) AS maxId FROM Currencies");
      const newId = (maxIdResult.recordset[0].maxId || 0) + 1;

      const insertRequest = new sql.Request(transaction);
      await insertRequest
        .input("id", sql.Int, newId)
        .input("name", sql.VarChar(100), name)
        .input("code", sql.VarChar(10), code)
        .query("INSERT INTO Currencies (id, name, code) VALUES (@id, @name, @code)");

      await transaction.commit();
      console.log(`Currency "${name}" added with Id = ${newId}`);
    } catch (error) {
      await transaction.rollback();
      console.error("Error adding currency: ", error);
      throw error;
    }
  }

  // оновити існуючу валюту за id (транзакційно)
  async updateCurrency(id, name, code) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      await request
        .input("id", sql.Int, id)
        .input("name", sql.VarChar(100), name)
        .input("code", sql.VarChar(10), code)
        .query(`
          UPDATE Currencies
          SET name = @name, code = @code
          WHERE id = @id
        `);
      await transaction.commit();
      console.log(`Currency with Id = ${id} updated.`);
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating currency: ", error);
      throw error;
    }
  }

  // видалити валюту та всі пов’язані курси валют (транзакційно)
  async deleteCurrency(id) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      await request
        .input("currencyId", sql.Int, id)
        .query("DELETE FROM ExchangeRates WHERE currencyId = @currencyId");

      await request
        .input("id", sql.Int, id)
        .query("DELETE FROM Currencies WHERE id = @id");

      await transaction.commit();
      console.log(`Currency with Id = ${id} and related exchange rates deleted.`);
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting currency and related exchange rates: ", error);
      throw error;
    }
  }

  // додати або оновити курс валюти на певну дату (транзакційно)
  async addOrUpdateExchangeRate(currencyId, date, buy, sell) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      const existingRate = await request
        .input("currencyId", sql.Int, currencyId)
        .input("date", sql.Date, date)
        .query(`
          SELECT * FROM ExchangeRates
          WHERE currencyId = @currencyId AND date = @date
        `);

      if (existingRate.recordset.length > 0) {
        await request
          .input("buy", sql.Decimal(18, 4), buy)
          .input("sell", sql.Decimal(18, 4), sell)
          .query(`
            UPDATE ExchangeRates
            SET buy = @buy, sell = @sell
            WHERE currencyId = @currencyId AND date = @date
          `);
        console.log(`Exchange rate updated for currencyId=${currencyId} on ${date}`);
      } else {
        await request
          .input("buy", sql.Decimal(18, 4), buy)
          .input("sell", sql.Decimal(18, 4), sell)
          .query(`
            INSERT INTO ExchangeRates (currencyId, date, buy, sell)
            VALUES (@currencyId, @date, @buy, @sell)
          `);
        console.log(`Exchange rate inserted for currencyId=${currencyId} on ${date}`);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("Error in addOrUpdateExchangeRate: ", error);
      throw error;
    }
  }
}

module.exports = new CurrencyRepositoryDB();
