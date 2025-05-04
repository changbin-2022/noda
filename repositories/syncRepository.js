const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/syncData.json');

function getAllRates() {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
}

module.exports = {
    getAllRates
};

