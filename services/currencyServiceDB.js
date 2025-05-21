const currencyRepositoryDB = require("../repositories/currencyRepositoryDB");

class CurrencyServiceDB {
  async getTodayRates() {
    const rates = await currencyRepositoryDB.getAllExchangeRates();
    const today = new Date().toISOString().split("T")[0];
    return rates.filter(rate => rate.date === today);
  }

  async getCurrencyRates(currencyId, startDate, endDate) {
    const rates = await currencyRepositoryDB.getAllExchangeRates();

    const filteredRates = rates.filter(rate =>
    rate.currencyId === parseInt(currencyId) &&
    new Date(rate.date) >= new Date(startDate) &&
    new Date(rate.date) <= new Date(endDate));


    return filteredRates.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getCurrencies() {
    return await currencyRepositoryDB.getAllCurrencies();
  }

  async createCurrency(name, code) {
    await currencyRepositoryDB.addCurrency(name, code);
  }

  async updateCurrency(currencyId, newName, newCode) {
    await currencyRepositoryDB.updateCurrency(currencyId, newName, newCode);
  }

  async deleteCurrency(currencyId) {
    await currencyRepositoryDB.deleteCurrency(currencyId);
  }

  async addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue) {
    await currencyRepositoryDB.addOrUpdateExchangeRate(
      currencyId,
      date,
      buyValue,
      sellValue
    );
  }
}

module.exports = new CurrencyServiceDB();
