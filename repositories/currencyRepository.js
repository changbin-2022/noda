const fs = require('fs');
const path = require('path');
const Currency = require('../models/currency');
const ExchangeRate = require('../models/exchangeRate');

const currenciesPath = path.join(__dirname, '../data/currencies.json');
const ratesPath = path.join(__dirname, '../data/exchangeRates.json');

class CurrencyRepository {
// асинхронне отримання всіх валют з використанням Promise
  getAllCurrenciesPromise() {
    return new Promise((resolve, reject) => {
      fs.readFile(currenciesPath, 'utf-8', (err, data) => {
        if (err) reject(err);
        else {
          const currencies = JSON.parse(data).map(c => new Currency(c.id, c.name, c.code));
          resolve(currencies);
        }
      });
    });
  }

  // асинхронне отримання всіх обмінних курсів з використанням async/await
  async getAllExchangeRatesAsync() {
    const data = await fs.promises.readFile(ratesPath, 'utf-8');
    return JSON.parse(data).map(r => new ExchangeRate(r.currencyId, r.date, r.buy, r.sell));
  }

  // синхронне додавання нової валюти
  addCurrency(name, code) {
    const data = fs.readFileSync(currenciesPath, 'utf-8'); // синхронне читання
    const currencies = JSON.parse(data);
    const id = Date.now().toString();
    currencies.push(new Currency(id, name, code));
    fs.writeFileSync(currenciesPath, JSON.stringify(currencies, null, 2)); // синхронний запис
  }

  // оновлення валюти з використанням async/await та Promise
  async updateCurrency(id, name, code) {
    const currencies = await this.getAllCurrenciesPromise();
    const index = currencies.findIndex(c => parseInt(c.id) === parseInt(id));
    if (index !== -1) {
      currencies[index].name = name;
      currencies[index].code = code;
      await fs.promises.writeFile(currenciesPath, JSON.stringify(currencies, null, 2)); // async/await
    }
  }

  // видалення обмінного курсу з використанням callback
  deleteExchangeRate(currencyId, callback) {
    fs.readFile(ratesPath, 'utf-8', (readErr, data) => { // callback
      if (readErr) {
        return callback(readErr);
      }

      let rates;
      try {
        rates = JSON.parse(data);
      } catch (parseErr) {
        return callback(parseErr);
      }

      rates = rates.filter(r => parseInt(r.currencyId) !== parseInt(currencyId));

      fs.writeFile(ratesPath, JSON.stringify(rates, null, 2), (writeErr) => { // callback
        if (writeErr) {
          return callback(writeErr);
        }

        callback(null); 
      });
    });
  }

  // видалення валюти з використанням async/await, Promise та callback
  async deleteCurrency(id) {
    // отримуємо всі валюти через проміс
    let currencies = await this.getAllCurrenciesPromise(); 
    currencies = currencies.filter(c => parseInt(c.id) !== parseInt(id));

    await new Promise((resolve, reject) => {
      this.deleteExchangeRate(id, (err) => { // callback
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    await fs.promises.writeFile(currenciesPath, JSON.stringify(currencies, null, 2)); // async/await
  }

  // додавання нового обмінного курсу з використанням async/await
  async addExchangeRate(currencyId, date, buy, sell) {
    const rates = await this.getAllExchangeRatesAsync();
    rates.push(new ExchangeRate(parseInt(currencyId), date, parseFloat(buy), parseFloat(sell)));
    await fs.promises.writeFile(ratesPath, JSON.stringify(rates, null, 2));
  }
}

module.exports = new CurrencyRepository();