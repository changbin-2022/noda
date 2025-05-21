const express = require("express");
const path = require("path");
const sequelize = require ('./dbSequelize')
const { Currency, ExchangeRate } = require('./models/sequelizeModels')
Currency.hasMany(ExchangeRate, { foreignKey: 'currencyId', as: 'exchangeRates' });
ExchangeRate.belongsTo(Currency, { foreignKey: 'currencyId', as: 'currency' });
// const { connectToDb, getPool } = require("./db");
const currencyController = require("./controllers/currencyControllerDB");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
const adminRouter = require("./routes/adminRouter");

app.use("/admin", adminRouter);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => currencyController.showHome(req, res));
app.get("/currency", (req, res) =>
  currencyController.showCurrencyHistory(req, res)
);

sequelize
  .sync()
  .then(async () => {
    console.log("Connection OK"); 
        
    const currencies = await Currency.findAll({
      order: [['id', 'ASC']],
      include: [{ model: ExchangeRate, as: 'exchangeRates' }]
    });

    const secondCurrency = currencies[1];
    if (secondCurrency) {
      console.log(`\nCurrency: ${secondCurrency.name} (${secondCurrency.code})`);
      if (secondCurrency.exchangeRates && secondCurrency.exchangeRates.length > 0) {
        console.log("Exchange Rates:");
        secondCurrency.exchangeRates.forEach(rate => {
          console.log(`  ${rate.date} → Buy: ${rate.buy}, Sell: ${rate.sell}`);
        });
      } else {
        console.log("No exchange rates found for this currency.");
      }

    } else {
      console.log("Second currency not found.");
    }

    app.listen(PORT)})
  .catch(err => console.log("Sync error:", err));


// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// connectToDb();
