const mongoose = require("mongoose");

const artistsSchema = mongoose.Schema({
    mbid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quotesFrom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuoteModel'
    }],
    quotesAbout: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuoteModel'
    }]
}, {collection: 'artists'})

module.exports = artistsSchema;