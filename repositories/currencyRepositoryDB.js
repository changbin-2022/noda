const { getPool } = require("../db");
const sql = require("mssql");
const Currency = require("../models/currency");
const ExchangeRate = require("../models/exchangeRate");

// CRUD: craate, read, update, delete
class CurrencyRepositoryDB {
  // асинхронне отримання всіх валют з бд (read)
  async getAllCurrencies() {
    const pool = getPool();
    try {
      const result = await pool.request().query("SELECT * FROM Currencies");
      return result.recordset.map((c) => new Currency(c.id, c.name, c.code));
    } catch (error) {
      console.error("Error getting all currencies: ", error);
      return [];
    }
  }

  // отримання всіх курсів валют (read)
  async getAllExchangeRates() {
    const pool = getPool();
    try {
      const result = await pool.request().query("SELECT * FROM ExchangeRates");
      return result.recordset.map(
        (r) => new ExchangeRate(r.currencyId, r.date, r.buy, r.sell)
      );
    } catch (error) {
      console.error("Error getting all exchange rates: ", error);
    }
  }

  // додавання валюти (create)
  async addCurrency(name, code) {
    const pool = getPool();
    try {
      const checkCode = await pool
        .request()
        .input("code", sql.VarChar(10), code)
        .query("SELECT * FROM Currencies WHERE code = @code");

      if (checkCode.recordset.length > 0) {
        throw new Error(`Currency with code "${code}" already exist.`);
      }

      const newId =
        ((await pool.request().query("SELECT MAX(id) AS maxId FROM Currencies"))
          .recordset[0].maxId || 0) + 1;

      await pool
        .request()
        .input("id", sql.Int, newId)
        .input("name", sql.VarChar(100), name)
        .input("code", sql.VarChar(10), code)
        .query(
          "INSERT INTO Currencies (id, name, code) VALUES (@id, @name, @code)"
        );

      console.log(`Currency "${name}" added, Id = "${newId}"`);
    } catch (error) {
      console.log("Error adding currency: ", error);
    }
  }

  // редагування
  async updateCurrency(id, name, code) {
    const pool = getPool();
    try {
      await pool
        .request()
        .input("id", sql.Int, id)
        .input("name", sql.VarChar(100), name)
        .input("code", sql.VarChar(10), code).query(`
          UPDATE Currencies
          SET name = @name,
              code = @code
          WHERE id = @id
        `);
    } catch (error) {
      console.error("Error updating currency: ", error);
    }
  }

  // видалення
  async deleteCurrency(id) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      // видалення курсу для валюти
      await request
        .input("currencyId", sql.Int, id)
        .query("DELETE FROM ExchangeRates WHERE currencyId = @currencyId");
      // видалення самої валюти
      await request
        .input("id", sql.Int, id)
        .query("DELETE FROM Currencies WHERE id = @id");

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(
        "Error deleting currency and related exchange rates:",
        error
      );
      throw error;
    }
  }

  async addOrUpdateExchangeRate(currencyId, date, buy, sell) {
    const pool = getPool();
    try {
      // перевірка чи вже існує курс на таку дату і валюту
      const existingRate = await pool
        .request()
        .input("currencyId", sql.Int, currencyId)
        .input("date", sql.Date, date).query(`
          SELECT * FROM ExchangeRates
          WHERE currencyId = @currencyId AND date = @date
        `);

      if (existingRate.recordset.length > 0) {
        // UPDATE
        await pool
          .request()
          .input("currencyId", sql.Int, currencyId)
          .input("date", sql.Date, date)
          .input("buy", sql.Decimal(18, 4), buy)
          .input("sell", sql.Decimal(18, 4), sell).query(`
            UPDATE ExchangeRates
            SET buy = @buy, sell = @sell
            WHERE currencyId = @currencyId AND date = @date
          `);

        console.log(
          `Exchange rate updated for currencyId=${currencyId} on ${date}`
        );
      } else {
        // INSERT
        await pool
          .request()
          .input("currencyId", sql.Int, currencyId)
          .input("date", sql.Date, date)
          .input("buy", sql.Decimal(18, 4), buy)
          .input("sell", sql.Decimal(18, 4), sell).query(`
            INSERT INTO ExchangeRates (currencyId, date, buy, sell)
            VALUES (@currencyId, @date, @buy, @sell)
          `);

        console.log(
          `Exchange rate inserted for currencyId=${currencyId} on ${date}`
        );
      }
    } catch (error) {
      console.error("Error in addOrUpdateExchangeRate: ", error);
    }
  }
}

module.exports = new CurrencyRepositoryDB();
