const path = require('path');
const Currency = require('../models/currency');
const ExchangeRate = require('../models/exchangeRate');

const currenciesPath = path.join(__dirname, '../data/currencies.json');
const ratesPath = path.join(__dirname, '../data/exchangeRates.json');

class CurrencyRepository {
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

  async getAllExchangeRatesAsync() {
    const data = await fs.promises.readFile(ratesPath, 'utf-8');
    return JSON.parse(data).map(r => new ExchangeRate(r.currencyId, r.date, r.rate));
  }

  addCurrency(name, code) {
    const data = fs.readFileSync(currenciesPath, 'utf-8');
    const currencies = JSON.parse(data);
    const id = Date.now().toString();
    currencies.push(new Currency(id, name, code));
    fs.writeFileSync(currenciesPath, JSON.stringify(currencies, null, 2));
  }

  async updateCurrency(id, name, code) {
    const currencies = await this.getAllCurrenciesPromise();
    const index = currencies.findIndex(c => parseInt(c.id) === parseInt(id));
    if (index !== -1) {
      currencies[index].name = name;
      currencies[index].code = code;
      await fs.promises.writeFile(currenciesPath, JSON.stringify(currencies, null, 2));
    }
  }

  deleteExchangeRate(currencyId, callback) {
    fs.readFile(ratesPath, 'utf-8', (readErr, data) => {
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

      fs.writeFile(ratesPath, JSON.stringify(rates, null, 2), (writeErr) => {
        if (writeErr) {
          return callback(writeErr);
        }

        callback(null); 
      });
    });
  }

  async deleteCurrency(id) {
    let currencies = await this.getAllCurrenciesPromise();
    currencies = currencies.filter(c => parseInt(c.id) !== parseInt(id));

    await new Promise((resolve, reject) => {
      this.deleteExchangeRate(id, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    await fs.promises.writeFile(currenciesPath, JSON.stringify(currencies, null, 2));
  }

  async addExchangeRate(currencyId, date, rate) {
    const rates = await this.getAllExchangeRatesAsync();
    rates.push(new ExchangeRate(parseInt(currencyId), date, parseFloat(rate)));
    await fs.promises.writeFile(ratesPath, JSON.stringify(rates, null, 2));
  }
}

module.exports = new CurrencyRepository();