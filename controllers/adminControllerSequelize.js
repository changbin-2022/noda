const currencyService = require("../services/currencyServiceSequelize");

class AdminControllerSequelize {
  async showAdminPage(req, res) {
    try {
      const currencies = await currencyService.getCurrencies();
      res.render("admin", { currencies });
    } catch (error) {
      console.error("Error loading admin page:", error);
      res.status(500).send("Server error");
    }
  }

  async createCurrency(req, res) {
    const { name, code } = req.body;
    try {
      await currencyService.createCurrency(name, code);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating currency:", error);
      res.status(500).send("Помилка при створенні валюти");
    }
  }

  async updateCurrency(req, res) {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
      await currencyService.updateCurrency(id, name, code);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error updating currency:", error);
      res.status(500).send("Помилка при оновленні валюти");
    }
  }

  async deleteCurrency(req, res) {
    const { id } = req.params;
    try {
      await currencyService.deleteCurrency(id);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error deleting currency:", error);
      res.status(500).send("Помилка при видаленні валюти");
    }
  }
  
  async createRate(req, res) {
  const { currencyId, date, buy, sell } = req.body;

  try {
    await currencyService.addOrUpdateExchangeRate(
      currencyId,
      date,
      parseFloat(buy),
      parseFloat(sell)
    );
    res.redirect("/admin");
  } catch (error) {
    console.error("Error performing rate transaction:", error);
    res.status(500).send("Помилка при збереженні курсу");
  }
}

}

module.exports = new AdminControllerSequelize();
