const currencyRepositoryDB = require("../repositories/currencyRepositoryDB");

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0]; // формат: 2025-05-16
}

class CurrencyServiceDB {
  async getTodayRates() {
    const rates = await currencyRepositoryDB.getAllExchangeRates();
    const today = new Date().toISOString().split("T")[0];
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
    return closestRates;
  }

  async getCurrencyRates(currencyId, startDate, endDate) {
    const rates = await currencyRepositoryDB.getAllExchangeRates();

    // Перетворення дат
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredRates = rates.filter((rate) => {
      const rateDate = new Date(rate.date);
      return (
        rate.currencyId === parseInt(currencyId) &&
        rateDate >= start &&
        rateDate <= end
      );
    });

    return filteredRates
      .map((rate) => ({
        ...rate,
        date: formatDate(rate.date),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getCurrencies() {
    return await currencyRepositoryDB.getAllCurrencies();
  }

  async createCurrency(name, code) {
    currencyRepositoryDB.addCurrency(name, code);
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
