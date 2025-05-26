const currencyService = require("../services/currencyServiceSequelize");

class AdminControllerSequelize {
  async getCurrencies(req, res) {
    try {
      const pagination = {
        page: req.query.page ?? 0,
        pageSize: req.query.pageSize ?? 20,
        sort: req.query.sort
      }
      const currencies = await currencyService.getCurrencies(pagination);
      res.status(200).json(currencies);
    } catch (error) {
      console.error("Error loading admin page:", error);
      res.status(500).send("Server error");
    }
  }

  async createCurrency(req, res) {
    const { name, code } = req.body;
    try {
      res.json(await currencyService.createCurrency(name, code));
      res.status(201)
    } catch (error) {
      console.error("Error creating currency:", error);
      res.status(500).send("Помилка при створенні валюти");
    }
  }

  async updateCurrency(req, res) {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
      res.json(await currencyService.updateCurrency(id, name, code));
      res.status(201)
    } catch (error) {
      console.error("Error updating currency:", error);
      res.status(500).send("Помилка при оновленні валюти");
    }
  }

  async deleteCurrency(req, res) {
    const { id } = req.params;
    try {
      await currencyService.deleteCurrency(id);
      res.status(204).send()
    } catch (error) {
      console.error("Error deleting currency:", error);
      res.status(500).send("Помилка при видаленні валюти");
    }
  }
  
  async createRate(req, res) {
  const { currencyId, date, buy, sell } = req.body;

  try {
    res.json(await currencyService.addOrUpdateExchangeRate(
      currencyId,
      date,
      parseFloat(buy),
      parseFloat(sell)
    ));
    res.status(201)
  } catch (error) {
    console.error("Error performing rate transaction:", error);
    res.status(500).send("Помилка при збереженні курсу");
  }
}

}

module.exports = new AdminControllerSequelize();
