const scrapesController = require("../controllers/scrapes.controller");
const usersController = require("../controllers/users.controller")
const express = require("express");
const Router = express.Router();
const {checkAuth} = require("../middlewares");

Router.post('/new-user', usersController.createUser);
Router.post('/login', usersController.adminLogin);
Router.get('/get-current-user', checkAuth, usersController.getCurrentUser);
Router.post('/scrape-url', checkAuth, scrapesController.scrapeUrl);
Router.get('/get-scrapped-data', checkAuth, scrapesController.getScrapedData);
Router.get('/get-scrapped-data/:id', checkAuth, scrapesController.getScrapedDataById);

module.exports = Router;