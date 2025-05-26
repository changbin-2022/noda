const currencyService = require("../services/currencyServiceSequelize");
const path = require("path");

class CurrencyControllerRest {

    async showHome(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "index-rest.html"))
    }

    async getCurrencyHistory(req, res) {
        try {
            const {currencyId, startDate, endDate} = req.query;
            const pagination = {
                page: req.query.page ?? 0,
                pageSize: req.query.pageSize ?? 20,
                sort: req.query.sort
            }
            const rates = await currencyService.getCurrencyRates(currencyId, startDate, endDate, pagination);
            const currencies = await currencyService.getCurrencies();

            const selectedCurrency = currencies.find(
                (c) => parseInt(c.id) === parseInt(currencyId)
            );
            const currencyName = selectedCurrency
                ? `${selectedCurrency.name} (${selectedCurrency.code})`
                : "Невідома валюта";

            res.json({currencies, rates, currencyName})
        } catch (error) {
            console.error("Error loading admin page:", error);
            res.status(500).send("Server error");
        }
    }

    async showCurrencyHistory(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "currency-rest.html"))
    }

    async getLatestRates(req, res) {
        try {
            const raw = await currencyService.getLatestRates();
            const resp = raw.map(rate => {
                const newRate = {...rate.dataValues}
                newRate.currencyCode = rate.currency.code;
                newRate.currencyName = rate.currency.name;
                delete newRate.currency;
                return newRate
            });
            res.json(resp);
        } catch (error) {
            console.error("Error loading admin page:", error);
            res.status(500).send("Server error");
        }
    }

}

module.exports = new CurrencyControllerRest();
