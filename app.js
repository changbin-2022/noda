const express = require("express");
const path = require("path");
const sequelize = require("./dbSequelize");
const { Currency, ExchangeRate } = require("./models/sequelizeModels");
const CurrencyControllerSequelize = require("./controllers/currencyControllerSequelize");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const adminRouter = require("./routes/adminRouter");
app.use("/admin", adminRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => CurrencyControllerSequelize.showHome(req, res));
app.get("/currency", (req, res) =>
  CurrencyControllerSequelize.showCurrencyHistory(req, res)
);

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

sequelize
  .sync()
  .then(async () => {
    console.log(`${colors.green}${colors.bold}\nSequelize connected successfully!${colors.reset}`);
    console.log(`${colors.cyan}Server running at: ${colors.bold}http://localhost:${PORT}${colors.reset}`);

    const currencies = await Currency.findAll({
      order: [["id", "ASC"]],
      include: [{ model: ExchangeRate, as: "exchangeRates" }],
    });

    if (currencies.length === 0) {
      console.log(`${colors.red}No currencies found in the database.${colors.reset}`);
    } else {
      console.log(`\n${colors.magenta}All Currencies with Exchange Rates:${colors.reset}`);
      currencies.forEach((currency, index) => {
        console.log(`\n${colors.bold}${index + 1}) ${currency.name} (${currency.code})${colors.reset}`);

        if (currency.exchangeRates?.length) {
          console.log(`  ${colors.yellow}Exchange Rates:${colors.reset}`);
          currency.exchangeRates.forEach((rate, i) => {
            console.log(
              `    ${i + 1}. ${rate.date} → Buy: ${rate.buy}, Sell: ${rate.sell}`
            );
          });
        } else {
          console.log(`  ${colors.red}No exchange rates found.${colors.reset}`);
        }
      });
    }

    app.listen(PORT);
  })
  .catch((err) =>
    console.log(`${colors.red}Sequelize sync error:${colors.reset}`, err)
  );







//app.js for 4-th lab


/*const express = require("express");
const path = require("path");
const { connectToDb } = require("./db");
const CurrencyControllerDB = require("./controllers/currencyControllerDB");
const adminRouter = require("./routes/adminRouter");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Роутинг
app.use("/admin", adminRouter);
app.get("/", (req, res) => CurrencyControllerDB.showHome(req, res));
app.get("/currency", (req, res) =>
  CurrencyControllerDB.showCurrencyHistory(req, res)
);

// Підключення до БД і запуск
connectToDb(); // встановлює pool
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
*/