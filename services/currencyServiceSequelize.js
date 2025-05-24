const currencyRepository = require("../repositories/currencyRepositorySequelize");

class CurrencyService {
  // Отримати найсвіжіші курси по кожній валюті (найближчі до сьогоднішньої дати)
  async getTodayRates() {
    const rates = await currencyRepository.getAllExchangeRates();
    const todayDate = new Date();

    const closestRates = Object.values(
      rates.reduce((acc, rate) => {
        const rateDate = new Date(rate.date);
        if (
          !acc[rate.currencyId] ||
          Math.abs(rateDate - todayDate) < Math.abs(new Date(acc[rate.currencyId].date) - todayDate)
        ) {
          acc[rate.currencyId] = rate;
        }
        return acc;
      }, {})
    );

    return closestRates.map(rate => ({
      id: rate.id,
      currencyId: rate.currencyId,
      date: rate.date,  
      buy: rate.buy,
      sell: rate.sell,
    }));
  }

  // Отримати курси для конкретної валюти за діапазон дат
  async getCurrencyRates(currencyId, startDate, endDate) {
    const allRates = await currencyRepository.getAllExchangeRates();
    const filtered = allRates
      .filter(rate =>
        rate.currencyId === parseInt(currencyId) &&
        new Date(rate.date) >= new Date(startDate) &&
        new Date(rate.date) <= new Date(endDate)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return filtered.map(rate => ({
      id: rate.id,
      currencyId: rate.currencyId,
      date: rate.date,  
      buy: rate.buy,
      sell: rate.sell,
    }));
  }

  // CRUD
  async getCurrencies() {
    return await currencyRepository.getAllCurrencies();
  }

  async createCurrency(name, code) {
    await currencyRepository.addCurrency(name, code);
  }

  async updateCurrency(currencyId, newName, newCode) {
    await currencyRepository.updateCurrency(currencyId, newName, newCode);
  }

  async deleteCurrency(currencyId) {
    await currencyRepository.deleteCurrency(currencyId);
  }

  // Додати/оновити курс
  async addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue) {
    await currencyRepository.addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue);
  }
}

module.exports = new CurrencyService();
