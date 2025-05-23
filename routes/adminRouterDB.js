const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllerDB");
const currencyController = require("../controllers/currencyControllerDB");
router.get("/", adminController.showAdminPage);

router.get("/currency-history", currencyController.showCurrencyHistory);

router.post("/currency/create", adminController.createCurrency);
router.post("/currency/update/:id", adminController.updateCurrency);
router.post("/currency/delete/:id", adminController.deleteCurrency);

router.post("/rate/create", adminController.createRate);

module.exports = router;
