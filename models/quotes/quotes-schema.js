const mongoose = require("mongoose");

const quotesSchema = mongoose.Schema({
    text: {type: String, required: true},
    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArtistModel'},
    subject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArtistModel'}],
    source: {type: String, required: true},
    sourceURL: {type: String, required: true},
    sourceDate: Date,
    admin: {
        submissionDate: {
            type: Date,
            default: Date.now()},
        submittedBy: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'UserModel'
                    },
        verified: {
            type: Boolean,
            default: false
        },
        verificationDate: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        }
    }
}, {collection: 'quotes'})

module.exports = quotesSchema;