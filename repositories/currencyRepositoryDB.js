const { getPool } = require("../db");
const Currency = require("../models/currency");
const ExchangeRate = require("../models/exchangeRate");

class CurrencyRepositoryDB {
  // асинхронне отримання всіх валют з бд
  async getAllCurrencies() {
    const pool = getPool();
    try {
      const [currencies] = await pool.query("SELECT * FROM Currencies");
      return currencies.map((c) => new Currency(c.id, c.name, c.code));
    } catch (error) {
      console.error("Error getting all currencies: ", error);
    }
  }

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
          "INSERT INTO Currencies (id, name, code) VALUES (@id, @name, @code"
        );

      console.log(`Currency "${name}" added, Id = "${newId}"`);
    } catch (error) {
      console.log("Error adding currency: ", error);
    }
  }
}
