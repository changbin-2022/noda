const currencyRepository = require("../repositories/currencyRepositorySequelize");

class CurrencyService {
    // Отримати найсвіжіші курси по кожній валюті (найближчі до сьогоднішньої дати)
    async getTodayRates() {
        const rates = await currencyRepository.getAllExchangeRates();
        const todayDate = new Date();

        const closestRates = Object.values(
            rates.reduce((acc, rate) => {
                const rateDate = new Date(rate.date);
                if (
                    !acc[rate.currencyId] ||
                    Math.abs(rateDate - todayDate) < Math.abs(new Date(acc[rate.currencyId].date) - todayDate)
                ) {
                    acc[rate.currencyId] = rate;
                }
                return acc;
            }, {})
        );

        return closestRates.map(rate => ({
            id: rate.id,
            currencyId: rate.currencyId,
            date: rate.date,
            buy: rate.buy,
            sell: rate.sell,
        }));
    }

    // Отримати курси для конкретної валюти за діапазон дат
    async getCurrencyRates(currencyId, startDate, endDate, pagination = {
        page: 0,
        pageSize: 100000000000,
        sort: "date,asc"
    }) {
        const allRates = await currencyRepository.getAllExchangeRates();
        const filtered = allRates
            .filter(rate =>
                rate.currencyId === parseInt(currencyId) &&
                new Date(rate.date) >= new Date(startDate) &&
                new Date(rate.date) <= new Date(endDate)
            )
            .sort((a, b) => {
                a = a.dataValues;
                b = b.dataValues;
                const sortSplit = (pagination.sort ?? "date,asc").split(",");
                const sortField = sortSplit[0]
                const sortDir = sortSplit[1] ?? "asc"
                let aVal = a[sortField];
                let bVal = b[sortField];
                if (sortField === "date") {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                const res = aVal - bVal
                return sortDir === "desc" ? -res : res;
            });

        return filtered.map(rate => ({
            id: rate.id,
            currencyId: rate.currencyId,
            date: rate.date,
            buy: rate.buy,
            sell: rate.sell,
        })).slice(pagination.page * pagination.pageSize, (pagination.page + 1) * pagination.pageSize);
    }

    // CRUD
    async getCurrencies(pagination = {
        page: 0,
        pageSize: 1000000 // default to unpaged for lab5
    }) {
        return await currencyRepository.getAllCurrencies(pagination);
    }

    async createCurrency(name, code) {
        return await currencyRepository.addCurrency(name, code);
    }

    async updateCurrency(currencyId, newName, newCode) {
        return await currencyRepository.updateCurrency(currencyId, newName, newCode);
    }

    async deleteCurrency(currencyId) {
        await currencyRepository.deleteCurrency(currencyId);
    }

    // Додати/оновити курс
    async addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue) {
        return await currencyRepository.addOrUpdateExchangeRate(currencyId, date, buyValue, sellValue);
    }

    async getLatestRates() {
        return await currencyRepository.getLatestExchangeRates();
    }
}

module.exports = new CurrencyService();
