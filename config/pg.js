const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connect() {
    try {
      await client.connect();
      console.log("Connected successfully");
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }
  
  connect();

module.exports = client;