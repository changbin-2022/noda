const fs =  require('fs').promises;
const path = require("path");

const dataPath = path.join(__dirname, "../data/syncData.json");

function getAllRatesPromise() {
    return fs.readFile(dataPath, 'utf-8')
        .then(data => JSON.parse(data));
}

module.exports = {
    getAllRatesPromise
}