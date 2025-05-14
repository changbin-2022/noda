const currencyRepository = require('../repositories/currencyRepository');

class CurrencyService {
  // знаходження найактуальніших курсів для кожної валюти
  async getTodayRates() {
    const rates = await currencyRepository.getAllExchangeRatesAsync();
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    const closestRates = Object.values(
        rates.reduce((acc, rate) => {
            if (!acc[rate.currencyId] || 
                Math.abs(new Date(rate.date) - todayDate) < 
                Math.abs(new Date(acc[rate.currencyId].date) - todayDate)) {
                acc[rate.currencyId] = rate;
            }
            return acc;
        }, {})
    );

    return closestRates;
  }

  // фільтрує курси за періодом для конкртеної валюти
  async getCurrencyRates(currencyId, startDate, endDate) {
    const rates = await currencyRepository.getAllExchangeRatesAsync();
    const filteredRates = rates.filter(rate => 
      rate.currencyId === parseInt(currencyId) &&
      rate.date >= startDate &&
      rate.date <= endDate
    );
    return filteredRates.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getCurrencies() {
    return await currencyRepository.getAllCurrenciesPromise();
  }

  createCurrency(name, code) {
    currencyRepository.addCurrency(name, code);
  }

  async updateCurrency(currencyId, newName, newCode) {
    await currencyRepository.updateCurrency(currencyId, newName, newCode);
  }

  async deleteCurrency(currencyId) {
    await currencyRepository.deleteCurrency(currencyId);
  }

  async addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue) {
    await currencyRepository.addExchangeRate(currencyId, date, buyValue, sellValue);
  }
}

module.exports = new CurrencyService();
