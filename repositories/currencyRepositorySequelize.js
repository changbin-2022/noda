const { Currency, ExchangeRate } = require("../models/sequelizeModels");

class currencyRepositorySequelize {
  // Отримати всі валюти (read)
  async getAllCurrencies() {
    try {
      return await Currency.findAll();
    } catch (error) {
      console.error("Error getting all currencies: ", error);
      return [];
    }
  }

  // Отримати всі курси валют (read)
  async getAllExchangeRates() {
    try {
      return await ExchangeRate.findAll();
    } catch (error) {
      console.error("Error getting all exchange rates: ", error);
      return [];
    }
  }

  // Додати нову валюту (create)
  async addCurrency(name, code) {
    try {
      // Перевірка на унікальність коду валюти
      const existing = await Currency.findOne({ where: { code } });
      if (existing) {
        throw new Error(`Currency with code "${code}" already exists.`);
      }
      const currency = await Currency.create({ name, code });
      console.log(`Currency "${name}" added, Id = "${currency.id}"`);
      return currency;
    } catch (error) {
      console.error("Error adding currency: ", error);
      throw error;
    }
  }

  // Оновлення валюти (update)
  async updateCurrency(id, name, code) {
    try {
      const currency = await Currency.findByPk(id);
      if (!currency) throw new Error("Currency not found");
      currency.name = name;
      currency.code = code;
      await currency.save();
    } catch (error) {
      console.error("Error updating currency: ", error);
      throw error;
    }
  }

  // Видалення валюти (delete) разом з курсами — через транзакцію
  async deleteCurrency(id) {
    const sequelize = Currency.sequelize;
    const transaction = await sequelize.transaction();
    try {
      await ExchangeRate.destroy({ where: { currencyId: id }, transaction });
      await Currency.destroy({ where: { id }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting currency and related exchange rates:", error);
      throw error;
    }
  }

  // Додавання або оновлення курсу валюти
  async addOrUpdateExchangeRate(currencyId, date, buy, sell) {
    try {
      let rate = await ExchangeRate.findOne({
        where: { currencyId, date },
      });

      if (rate) {
        rate.buy = buy;
        rate.sell = sell;
        await rate.save();
        console.log(
          `Exchange rate updated for currencyId=${currencyId} on ${date}`
        );
      } else {
        await ExchangeRate.create({ currencyId, date, buy, sell });
        console.log(
          `Exchange rate inserted for currencyId=${currencyId} on ${date}`
        );
      }
    } catch (error) {
      console.error("Error in addOrUpdateExchangeRate: ", error);
      throw error;
    }
  }
}

module.exports = new currencyRepositorySequelize();
