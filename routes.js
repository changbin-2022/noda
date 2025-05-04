const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFile = path.join(__dirname, 'data', 'syncData.json');

function loadRates() {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
}

function saveRates(rates) {
    fs.writeFileSync(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
}

router.post('/admin/add', (req, res) => {
    const { currencyCode, buyRate, sellRate, nbuRate } = req.body;
    const rates = loadRates();

    rates.push({
        currencyCode,
        buyRate: parseFloat(buyRate),
        sellRate: parseFloat(sellRate),
        nbuRate: parseFloat(nbuRate)
    });

    saveRates(rates);
    res.redirect('/admin');
});

router.post('/admin/edit', (req, res) => {
    const { currencyCodeEdit, newBuyRate, newSellRate, newNbuRate } = req.body;
    const rates = loadRates();

    const rate = rates.find(r => r.currencyCode === currencyCodeEdit);
    if (rate) {
        if (newBuyRate) rate.buyRate = parseFloat(newBuyRate);
        if (newSellRate) rate.sellRate = parseFloat(newSellRate);
        if (newNbuRate) rate.nbuRate = parseFloat(newNbuRate);
    }

    saveRates(rates);
    res.redirect('/admin');
});

router.post('/admin/delete', (req, res) => {
    const { currencyCodeDelete } = req.body;
    let rates = loadRates();

    rates = rates.filter(r => r.currencyCode !== currencyCodeDelete);
    saveRates(rates);

    res.redirect('/admin');
});

module.exports = router;
