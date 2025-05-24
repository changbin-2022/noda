const currencyService = require("../services/currencyServiceSequelize");

class CurrencyControllerSequelize {
  async showHome(req, res) {
    try {
      const rates = await currencyService.getTodayRates();
      const currencies = await currencyService.getCurrencies();
      res.render("index", { currencies, rates });
    } catch (error) {
      console.error("Error loading currency history:", error);
      res.status(500).send("Server error");
    }
  }

  async showCurrencyHistory(req, res) {
    try {
      const { currencyId, startDate, endDate } = req.query;
      const rates = await currencyService.getCurrencyRates(currencyId, startDate, endDate);
      const currencies = await currencyService.getCurrencies();

      const selectedCurrency = currencies.find(
        (c) => parseInt(c.id) === parseInt(currencyId)
      );
      const currencyName = selectedCurrency
        ? `${selectedCurrency.name} (${selectedCurrency.code})`
        : "Невідома валюта";

      res.render("currency", { currencies, rates, currencyName });
    } catch (error) {
      console.error("Error loading currency history:", error);
      res.status(500).send("Server error");
    }
  }

  async showAdminPage(req, res) {
    try {
      const currencies = await currencyService.getCurrencies();
      res.render("admin", { currencies });
    } catch (error) {
      console.error("Error loading admin page:", error);
      res.status(500).send("Server error");
    }
  }
}

module.exports = new CurrencyControllerSequelize();
