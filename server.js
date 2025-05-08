const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const adminRoutes = require('./routes');
app.use(adminRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { getAllRates } = require('./repositories/syncRepository');
const { getAllRatesCallback } = require('./repositories/callbackRepository');
const { getAllRatesPromise } = require("./repositories/promiseRepository");
const {getAllRatesAsync } = require("./repositories/asyncRepository")

app.get('/', (req, res) => {
    const rates = getAllRates();
    res.render('index', {rates});
});

app.get('/callback', (req, res) => {
    getAllRatesCallback((error, rates) => {
        if (error) return res.status(500).send('Помилка зчитування файлу');
        res.render('index', { rates });
    }) 
})

app.get('/promise', (req, res) => {
    getAllRatesPromise()
        .then(rates => res.render('index', { rates }))
        .catch(() => res.status(500).send('Помилка зчитування файлу'));
})

app.get('/async', async (req, res) => {
    try {
        const rates = await getAllRatesAsync();
        res.render('index', { rates });
    } catch (error) {
        res.status(500).send('Помилка зчитування файлу');
    }
})

app.get('/admin/sync', (req, res) => {
    const rates = getAllRates();
    res.render('admin', { rates, isCallback: false, isPromise: false, isAsync: false });
});

app.get('/admin/callback', (req, res) => {
    getAllRatesCallback((error, rates) => {
        if (error) return res.status(500).send('Помилка зчитування файлу');
        res.render('admin', { rates, isCallback: true, isPromise: false, isAsync: false })
    })
    
})

app.get('/admin/promise', (req, res) => {
    getAllRatesPromise()
        .then(rates => res.render('admin', { rates, isCallback: false, isPromise: true, isAsync: false }))
        .catch(() => res.status(500).send('Помилка зчитування файлу'));
})

app.get('/admin/async', async (req, res) => {
    try {
        const rates = await getAllRatesAsync();
        res.render('admin', { rates, isCallback: false, isPromise: false, isAsync: true });
    } catch (error) {
        res.status(500).send('Помилка зчитування файлу');
    }
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
