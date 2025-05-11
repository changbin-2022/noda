const currencyService = require('../services/currencyService');

class AdminController {
  async showAdminPage(req, res) {
    const currencies = await currencyService.getCurrencies();
    res.render('admin', { currencies });
  }

  createCurrency(req, res) {
    const { name, code } = req.body;
    currencyService.createCurrency(name, code);
    res.redirect('/admin');
  }

  async updateCurrency(req, res) {
    const { id } = req.params;
    const { name, code } = req.body;
    await currencyService.updateCurrency(id, name, code);
    res.redirect('/admin');
  }

  async deleteCurrency(req, res) {
    const { id } = req.params;
    await currencyService.deleteCurrency(id);
    res.redirect('/admin');
  }

  async createRate(req, res) {
    const { currencyId, date, rate } = req.body;
    await currencyService.addOrUpdateExchangeRate(currencyId, date, rate);
    res.redirect('/admin');
  }
}

module.exports = new AdminController();
