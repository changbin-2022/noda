const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFile = path.join(__dirname, 'data', 'syncData.json');
const fsPromises = require('fs').promises;
// sync admin panel
function loadRatesSync() {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
}

function saveRatesSync(rates) {
    fs.writeFileSync(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
}

router.post('/admin/add', (req, res) => {
    const { currencyCode, buyRate, sellRate, nbuRate } = req.body;
    const rates = loadRatesSync();

    rates.push({
        currencyCode,
        buyRate: parseFloat(buyRate),
        sellRate: parseFloat(sellRate),
        nbuRate: parseFloat(nbuRate)
    });

    saveRatesSync(rates);
    res.redirect('/admin/sync');
});

router.post('/admin/edit', (req, res) => {
    const { currencyCodeEdit, newBuyRate, newSellRate, newNbuRate } = req.body;
    const rates = loadRatesSync();

    const rate = rates.find(r => r.currencyCode === currencyCodeEdit);
    if (rate) {
        if (newBuyRate) rate.buyRate = parseFloat(newBuyRate);
        if (newSellRate) rate.sellRate = parseFloat(newSellRate);
        if (newNbuRate) rate.nbuRate = parseFloat(newNbuRate);
    }

    saveRatesSync(rates);
    res.redirect('/admin/sync');
});

router.post('/admin/delete', (req, res) => {
    const { currencyCodeDelete } = req.body;
    let rates = loadRatesSync();

    rates = rates.filter(r => r.currencyCode !== currencyCodeDelete);
    saveRatesSync(rates);

    res.redirect('/admin/sync');
});


// callback admin panel
router.post('/admin-cb/add', (req, res) => {
    const { currencyCode, buyRate, sellRate, nbuRate } = req.body;

    fs.readFile(dataFile, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання даних');
        const rates = JSON.parse(data);

        rates.push({
            currencyCode,
            buyRate: parseFloat(buyRate),
            sellRate: parseFloat(sellRate),
            nbuRate: parseFloat(nbuRate)
        });

        fs.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8', (err) => {
            if (err) return res.status(500).send('Помилка запису даних');
            res.redirect('/admin/callback');
        });
    });
});

router.post('/admin-cb/edit', (req, res) => {
    const { currencyCodeEdit, newBuyRate, newSellRate, newNbuRate } = req.body;

    fs.readFile(dataFile, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання');
        const rates = JSON.parse(data);

        const rate = rates.find(r => r.currencyCode === currencyCodeEdit);
        if (rate) {
            if (newBuyRate) rate.buyRate = parseFloat(newBuyRate);
            if (newSellRate) rate.sellRate = parseFloat(newSellRate);
            if (newNbuRate) rate.nbuRate = parseFloat(newNbuRate);
        }

        fs.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8', (err) => {
            if (err) return res.status(500).send('Помилка запису');
            res.redirect('/admin/callback');
        });
    });
});

router.post('/admin-cb/delete', (req, res) => {
    const { currencyCodeDelete } = req.body;

    fs.readFile(dataFile, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Помилка читання');
        let rates = JSON.parse(data);

        rates = rates.filter(r => r.currencyCode !== currencyCodeDelete);

        fs.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8', (err) => {
            if (err) return res.status(500).send('Помилка запису');
            res.redirect('/admin/callback');
        });
    });
});

// promise admin panel
router.post('/admin-pm/add', async (req, res) => {
    const { currencyCode, buyRate, sellRate, nbuRate } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        const rates = JSON.parse(data);

        rates.push({
            currencyCode,
            buyRate: parseFloat(buyRate),
            sellRate: parseFloat(sellRate),
            nbuRate: parseFloat(nbuRate)
        });

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/promise');
    } catch (err) {
        res.status(500).send('Помилка при обробці файлу');
    }
});

router.post('/admin-pm/edit', async (req, res) => {
    const { currencyCodeEdit, newBuyRate, newSellRate, newNbuRate } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        const rates = JSON.parse(data);

        const rate = rates.find(r => r.currencyCode === currencyCodeEdit);
        if (rate) {
            if (newBuyRate) rate.buyRate = parseFloat(newBuyRate);
            if (newSellRate) rate.sellRate = parseFloat(newSellRate);
            if (newNbuRate) rate.nbuRate = parseFloat(newNbuRate);
        }

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/promise');
    } catch (err) {
        res.status(500).send('Помилка при редагуванні');
    }
});

router.post('/admin-pm/delete', async (req, res) => {
    const { currencyCodeDelete } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        let rates = JSON.parse(data);

        rates = rates.filter(r => r.currencyCode !== currencyCodeDelete);

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/promise');
    } catch (err) {
        res.status(500).send('Помилка при видаленні');
    }
});

// async admin panel
router.post('/admin-async/add', async (req, res) => {
    const { currencyCode, buyRate, sellRate, nbuRate } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        const rates = JSON.parse(data);

        rates.push({
            currencyCode,
            buyRate: parseFloat(buyRate),
            sellRate: parseFloat(sellRate),
            nbuRate: parseFloat(nbuRate)
        });

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/async');
    } catch (err) {
        res.status(500).send('Помилка при обробці файлу');
    }
});

router.post('/admin-async/edit', async (req, res) => {
    const { currencyCodeEdit, newBuyRate, newSellRate, newNbuRate } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        const rates = JSON.parse(data);

        const rate = rates.find(r => r.currencyCode === currencyCodeEdit);
        if (rate) {
            if (newBuyRate) rate.buyRate = parseFloat(newBuyRate);
            if (newSellRate) rate.sellRate = parseFloat(newSellRate);
            if (newNbuRate) rate.nbuRate = parseFloat(newNbuRate);
        }

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/async');
    } catch (err) {
        res.status(500).send('Помилка при редагуванні');
    }
});

router.post('/admin-async/delete', async (req, res) => {
    const { currencyCodeDelete } = req.body;
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        let rates = JSON.parse(data);

        rates = rates.filter(r => r.currencyCode !== currencyCodeDelete);

        await fsPromises.writeFile(dataFile, JSON.stringify(rates, null, 2), 'utf-8');
        res.redirect('/admin/async');
    } catch (err) {
        res.status(500).send('Помилка при видаленні');
    }
});


module.exports = router;
