const currencyRepositoryDB = require("../repositories/currencyRepositoryDB");

class CurrencyServiceDB {
  // Отримати найсвіжіші курси по кожній валюті (найближчі до сьогоднішньої дати)
  async getTodayRates() {
    const rates = await currencyRepositoryDB.getAllExchangeRates();
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    const closestRates = Object.values(
      rates.reduce((acc, rate) => {
        if (
          !acc[rate.currencyId] ||
          Math.abs(new Date(rate.date) - todayDate) <
            Math.abs(new Date(acc[rate.currencyId].date) - todayDate)
        ) {
          acc[rate.currencyId] = rate;
        }
        return acc;
      }, {})
    );

    return closestRates.map(rate => ({
      ...rate,
      date: new Date(rate.date).toISOString().split('T')[0],
    }));
  }

  // Отримати курси для конкретної валюти за діапазон дат
  async getCurrencyRates(currencyId, startDate, endDate) {
    const rates = await currencyRepositoryDB.getAllExchangeRates();

    const filteredRates = rates
      .filter(
        rate =>
          rate.currencyId === parseInt(currencyId) &&
          new Date(rate.date) >= new Date(startDate) &&
          new Date(rate.date) <= new Date(endDate)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return filteredRates.map(rate => ({
      ...rate,
      date: new Date(rate.date).toISOString().split('T')[0],
    }));
  }

  // Отримати список валют
  async getCurrencies() {
    return await currencyRepositoryDB.getAllCurrencies();
  }

  // Створити нову валюту
  async createCurrency(name, code) {
    await currencyRepositoryDB.addCurrency(name, code);
  }

  // Оновити валюту
  async updateCurrency(currencyId, newName, newCode) {
    await currencyRepositoryDB.updateCurrency(currencyId, newName, newCode);
  }

  // Видалити валюту
  async deleteCurrency(currencyId) {
    await currencyRepositoryDB.deleteCurrency(currencyId);
  }

  // Додати або оновити курс валюти
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
