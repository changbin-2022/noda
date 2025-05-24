const express = require('express');
const path = require('path');
const currencyController = require('./controllers/currencyController');

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const adminRouter = require('./routes/adminRouter');

app.use('/admin', adminRouter);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => currencyController.showHome(req, res));
app.get('/currency', (req, res) => currencyController.showCurrencyHistory(req, res));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});