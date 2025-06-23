const mongoose = require("mongoose");

const scrapesSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    bodyContent: {
        type: String,
        required: true
    },
    fields: {
        type: Array,
        default: []
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Scrapes = mongoose.model("scrapes", scrapesSchema);
module.exports = Scrapes;