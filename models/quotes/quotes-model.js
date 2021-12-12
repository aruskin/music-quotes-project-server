const mongoose = require("mongoose");
const quotesSchema = require("./quotes-schema");
const quotesModel = mongoose.model("QuoteModel", quotesSchema);
module.exports = quotesModel;