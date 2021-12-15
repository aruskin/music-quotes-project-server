const quotesDao = require('../daos/quotes-dao');
const userDao = require('../daos/users-dao');
const artistsModel = require("../models/artists/artists-model");
const quotesModel = require("../models/quotes/quotes-model");
const usersModel = require("../models/users/users-model");


module.exports = (app) => {
    const findAllQuotes = (req, res) =>
        quotesDao.findAllQuotes()
            .then(quotes => res.json(quotes));

    async function submitQuote(req, res){
        const currentUser = req.session['profile'];

        if(currentUser){
            if(currentUser.role !== 'BANNED'){
                let newQuote = {
                    "admin": {
                        "submissionDate": Date.now(),
                        "submittedBy": currentUser
                    },
                    "text": req.body["text"],
                    "source": req.body["source"],
                    "sourceURL": req.body["sourceURL"],
                    "sourceDate": req.body["sourceDate"]
                };
                if(currentUser.role === 'ADMIN'){
                    newQuote = {
                        ...newQuote,
                        "admin.verified": true,
                        "admin.verificationDate": Date.now(),
                        "admin.verifiedBy": currentUser
                    };
                }
                let createdQuote = await quotesDao.createQuote(newQuote);

                let speaker = await artistsModel.findOneAndUpdate(
                    {mbid: req.body['speaker'].mbid, name: req.body['speaker'].name},
                    {$push: {quotesFrom: createdQuote._id}},
                    {upsert: true, new: true, useFindAndModify: true});

                let subject_ids = [];
                await Promise.all(req.body['subject'].map(async (item, index) => {
                    const artist = await artistsModel.findOneAndUpdate(
                                                               {mbid: item.mbid, name: item.name},
                                                               {$push: {quotesAbout: createdQuote._id}},
                                                               {upsert: true, new: true, useFindAndModify: true});
                    subject_ids.push(artist._id)
                }));

                let user = await usersModel.findOneAndUpdate(
                    {_id: currentUser._id},
                    {$push: {submittedQuotes: createdQuote._id}},
                    {new: true, useFindAndModify: true}
                );

                createdQuote = await quotesModel.updateOne(
                    createdQuote,
                    {$set: {speaker: speaker._id, subject: subject_ids}}
                );
                return(res.json(createdQuote))
            }

        }else{
            res.send({error: 'Insufficient permissions to submit quote'});
        }
    }

    async function deleteQuote(req, res){
        const currentUser = req.session['profile'];
        if(currentUser){
            const quoteId = req.params.id;
            if(currentUser.role === 'ADMIN'){
                let quote = await quotesDao.findQuoteById(quoteId);
                if(quote){
                    //Remove quote from quotesFrom and quotesAbout on artists
                    let relatedArtists = await artistsModel.find({$or: [
                        {_id: quote.speaker},
                        {_id: {$in: quote.subject}}]});

                    let updatedArtists = [];
                    await Promise.all(relatedArtists.map(async (item, index) => {
                            const updatedArtist = await artistsModel.findOneAndUpdate(
                                {_id: item._id},
                                {$pull: {quotesFrom: quoteId, quotesAbout: quoteId}},
                                {new: true, useFindAndModify: true});
                            updatedArtists.push(updatedArtist);
                            }
                           )
                     );

                    //Remove quote from submittedQuotes on users and increment deletedQuotes
                    let updatedUser = await usersModel.findOneAndUpdate(
                            {_id: quote.admin.submittedBy},
                            {$pull: {submittedQuotes: quoteId}, $inc: {deletedQuotes: 1}},
                            {new: true, useFindAndModify: true});


                    //Remove quote from quotes collection
                    await quotesDao.deleteQuote(quoteId)
                        .then((status) => res.send(status));
                }else{
                    res.send({error: 'Invalid quote ID'})
                }
            }
         } else {
            res.send({error: 'Insufficient permissions to delete quote'});
         }
    }

    const findQuoteById = (req, res) =>
        quotesDao.findQuoteById(req.params.id)
            .then(quote => res.json(quote));

    async function verifyQuote(req, res){
        const currentUser = req.session['profile'];
        if(currentUser){
            if(currentUser.role === 'ADMIN'){
                const id = req.body.id;
                let quote = await quotesDao.findQuoteById(id);
                quote.admin.verified = true;
                quote.admin.verificationDate = Date.now();
                quote.admin.verifiedBy = currentUser._id;
                quotesDao.updateQuote(id, quote)
                    .then((status) => res.send(status))
            }
        }else{
            res.send({error: 'Insufficient permissions to update quote'});
        }
    }

    app.post('/api/quotes', submitQuote);
    app.get('/api/quotes/:id', findQuoteById);
    app.get('/api/quotes', findAllQuotes);
    app.put('/api/quotes/verify', verifyQuote);
    app.delete('/api/quotes/:id', deleteQuote);
}