require('dotenv').config();
const express = require('express');
const { initializeBrowser } = require('./browser.js');
const dbConnection = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

const server = express();
const PORT = 5000;

server.use(express.json());
server.use(cors());

dbConnection();
initializeBrowser();

server.use("/admin", adminRoutes);

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

