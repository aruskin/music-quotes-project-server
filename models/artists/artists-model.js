const mongoose = require("mongoose");
const artistsSchema = require("./artists-schema");
const artistsModel = mongoose.model("ArtistModel", artistsSchema);
module.exports = artistsModel;