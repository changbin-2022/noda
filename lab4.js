const express = require("express");
const path = require("path");
const { connectToDb } = require("./db");
const CurrencyControllerDB = require("./controllers/currencyControllerDB");
const adminRouter = require("./routes/adminRouterDB");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", adminRouter);
app.get("/", (req, res) => CurrencyControllerDB.showHome(req, res));
app.get("/currency", (req, res) =>
  CurrencyControllerDB.showCurrencyHistory(req, res)
);
 
connectToDb(); 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});