const mongoose = require("mongoose");

const dbConnection  = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/ai-scrapper-secureweb",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = dbConnection;