const { Currency, ExchangeRate } = require('../models/sequelizeModels');
const sequelize = require('../dbSequelize');

class CurrencyRepositorySequelize {
  // отримати всі валюти з бази
  async addCurrency(name, code) {
    const t = await sequelize.transaction();
    try {
      const existing = await Currency.findOne({ where: { code }, transaction: t });
      if (existing) throw new Error(`Currency with code "${code}" already exists.`);

      const maxId = await Currency.max('id', { transaction: t }) || 0;
      const newCurrency = await Currency.create({ id: maxId + 1, name, code }, { transaction: t });

      await t.commit();
      console.log(`Currency "${name}" added with Id = ${newCurrency.id}`);
      return newCurrency;
    } catch (error) {
      await t.rollback();
      console.error("Error adding currency: ", error);
      throw error;
    }
  }

  // отримати всі курси валют з бази
  async getAllCurrencies() {
    try {
      return await Currency.findAll();
    } catch (error) {
      console.error("Error getting all currencies: ", error);
      return [];
    }
  }

  
  // оновити валюту за id (транзакційно)
  async updateCurrency(id, name, code) {
    const t = await sequelize.transaction();
    try {
      const currency = await Currency.findByPk(id, { transaction: t });
      if (!currency) throw new Error(`Currency with id=${id} not found.`);

      await currency.update({ name, code }, { transaction: t });
      await t.commit();
      console.log(`Currency with Id = ${id} updated.`);
    } catch (error) {
      await t.rollback();
      console.error("Error updating currency: ", error);
      throw error;
    }
  }

  // видалити валюту та всі пов’язані курси валют (транзакційно)
  async deleteCurrency(id) {
    const t = await sequelize.transaction();
    try {
      await ExchangeRate.destroy({ where: { currencyId: id }, transaction: t });
      await Currency.destroy({ where: { id }, transaction: t });

      await t.commit();
      console.log(`Currency with Id = ${id} and related exchange rates deleted.`);
    } catch (error) {
      await t.rollback();
      console.error("Error deleting currency and related exchange rates: ", error);
      throw error;
    }
  }

  // додати або оновити курс валюти на певну дату (транзакційно)
  async addOrUpdateExchangeRate(currencyId, date, buy, sell) {
    const t = await sequelize.transaction();
    try {
      const existing = await ExchangeRate.findOne({
        where: { currencyId, date },
        transaction: t,
      });

      if (existing) {
        await existing.update({ buy, sell }, { transaction: t });
        console.log(`Exchange rate updated for currencyId=${currencyId} on ${date}`);
      } else {
        await ExchangeRate.create({ currencyId, date, buy, sell }, { transaction: t });
        console.log(`Exchange rate inserted for currencyId=${currencyId} on ${date}`);
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error("Error in addOrUpdateExchangeRate: ", error);
      throw error;
    }
  }

  // отримати всі курси валют з пов’язаною валютою
  async getAllExchangeRates() {
    try {
      return await ExchangeRate.findAll({
        include: {
          model: Currency,
          as: 'currency'
        }
      });
    } catch (error) {
      console.error("Error getting all exchange rates: ", error);
      return [];
    }
  }
}

module.exports = new CurrencyRepositorySequelize();
