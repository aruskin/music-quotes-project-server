const quotesModel = require("../models/quotes/quotes-model")

//const findQuotesBySpeaker = (artist) => {
//    return quotesModel.find({speaker: artist})
//}
//
//const findQuotesBySubject = (artist) => {
//    return artist.quotesAbout
//                .map((quote) => quotesModel.find{quote})
//}

const createQuote = (quote) => {
    return quotesModel.create(quote)
}

const findQuoteById = (id) => {
    return quotesModel.findById(id)
            .populate({path: 'speaker', select: ['mbid', 'name']})
            .populate({path: 'subject', select: ['mbid', 'name']})
            .populate({path: 'admin',
                populate: {path: 'submittedBy', select: ['_id', 'username']}})
            .sort({"admin.submissionDate": -1})
            .exec()
}

const findAllQuotes = () => {
    return quotesModel.find()
            .populate({path: 'speaker', select: ['mbid', 'name']})
            .populate({path: 'subject', select: ['mbid', 'name']})
            .populate({path: 'admin',
                            populate: {path: 'submittedBy', select: ['_id', 'username']}})
            .sort({"admin.submissionDate": -1})
            .exec()

}

const updateQuote = (id, quote) => {
    return quotesModel.updateOne(
        {_id: id},
        {$set: quote})
}

const deleteQuote = (id) => {
    return quotesModel.deleteOne({_id: id})
}

module.exports = {
    createQuote, findQuoteById, findAllQuotes, updateQuote, deleteQuote
}