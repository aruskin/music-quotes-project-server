const artistsModel = require("../models/artists/artists-model")

//const createArtist = (artist) =>
//    return artistsModel.create(artist)
//}

const findOrCreateArtistById = (id, artist) => {
    return artistsModel.findByIdAndUpdate(id,
        {$set: artist},
        {upsert: true},
        {new: true})
}

module.exports = {
    findOrCreateArtistById
}