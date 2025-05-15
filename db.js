const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'ExchangeRate',
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'DESKTOP-ALGL9A7',
      userName: 'oksana',
      password: '1832'
    }
  }
};

let pool;

const connectToDb = async () => {
  try {
    pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM Currencies');
      console.log('Currencies table:', result.recordset);
    } catch (err) {
      console.error('Database connection failed:', err);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database connection is not established');
  }
    return pool;
};

module.exports = { connectToDb, getPool };
