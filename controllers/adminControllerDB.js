const currencyService = require("../services/currencyServiceDB");

class AdminControllerDB {
  async showAdminPage(req, res) {
    const currencies = await currencyService.getCurrencies();
    res.render("admin", { currencies });
  }

  async createCurrency(req, res, next) {
    const { name, code } = req.body;
    try {
      await currencyService.createCurrency(name, code);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating currency:", error);
      if (error.message.includes("already exists")) {
        return res
          .status(400)
          .render("admin", { currencies: await currencyService.getCurrencies(), error: error.message });
      }
      next(error);
    }
  }

  async updateCurrency(req, res, next) {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
      await currencyService.updateCurrency(id, name, code);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error updating currency:", error);
      next(error);
    }
  }

  async deleteCurrency(req, res, next) {
    const { id } = req.params;
    try {
      await currencyService.deleteCurrency(id);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error deleting currency:", error);
      next(error);
    }
  }

  async createRate(req, res, next) {
    const { currencyId, date, buy, sell } = req.body;
    try {
      await currencyService.addOrUpdateExchangeRate(currencyId, date, buy, sell);
      res.redirect("/admin");
    } catch (error) {
      console.error("Error creating/updating rate:", error);
      next(error);
    }
  }
}

module.exports = new AdminControllerDB();
