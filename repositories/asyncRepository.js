const fs = require("fs")
const path = require("path")

const dataPath = path.join(__dirname, "../data/syncData.json");

async function getAllRatesAsync() {
    const data = await fs.promises.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
}

module.exports = {
    getAllRatesAsync
}