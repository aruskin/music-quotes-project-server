const artistsModel = require("../models/artists/artists-model");

module.exports = (app) => {
    const findArtistByMBID = (req, res) =>
        artistsModel.findOne({mbid: req.params['mbid']})
            .then(artist => res.json(artist));

    app.get('/api/artists/:mbid', findArtistByMBID);
}


