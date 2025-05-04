const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/syncData.json");

function getAllRatesCallback(callback) {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) throw err;
        callback(null, JSON.parse(data));
    });
}

module.exports = {
    getAllRatesCallback
}