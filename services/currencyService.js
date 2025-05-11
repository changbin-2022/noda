const currencyRepository = require('../repositories/currencyRepository');

class CurrencyService {
  async getTodayRates() {
    const rates = await currencyRepository.getAllExchangeRatesAsync();
    const today = new Date().toISOString().split('T')[0];
    return rates.filter(rate => rate.date === today);
  }

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

  async addOrUpdateExchangeRate(currencyId, date, rateValue) {
    await currencyRepository.addExchangeRate(currencyId, date, rateValue);
  }
}

module.exports = new CurrencyService();
