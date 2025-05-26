const express = require("express");
const path = require("path");
const router = express.Router();
const adminController = require("../controllers/adminControllerRest");
const currencyController = require("../controllers/currencyControllerRest");

router.get("/", async (_, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "admin-rest.html"))
});

router.get("/api/currency", adminController.getCurrencies);

router.get("/api/currency-history", currencyController.getCurrencyHistory);
router.get("/api/latest-rates", currencyController.getLatestRates)

router.post("/api/currency/create", adminController.createCurrency);
router.patch("/api/currency/update/:id", adminController.updateCurrency);
router.delete("/api/currency/delete/:id", adminController.deleteCurrency);

router.post("/api/rate", adminController.createRate);

module.exports = router;
