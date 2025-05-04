const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const adminRoutes = require('./routes');

app.use(adminRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { getAllRates } = require('./repositories/syncRepository');
const { getAllRatesCallback } = require('./repositories/callbackRepository');

// app.get('/', (req, res) => {
//     const rates = getAllRates();
//     res.render('index', { rates });
// });

// app.get('/admin', (req, res) => {
//     const rates = getAllRates();
//     res.render('admin', { rates });
// });

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

app.get('/admin/sync', (req, res) => {
    const rates = getAllRates();
    res.render('admin', { rates });
});

app.get('/admin/callback', (req, res) => {
    getAllRatesCallback((error, rates) => {
        if (error) return res.status(500).send('Помилка зчитування файлу');
        res.render('admin', { rates })
    })
    
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
