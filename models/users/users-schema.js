const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'DEFAULT', 'BANNED'],
        default: 'DEFAULT',
        required: true
    },
    submittedQuotes:  [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'QuoteModel'
     }],
    accountCreationDate: {
        type: Date,
        default: Date.now(),
        required: true},
    deletedQuotes: {
        type: Number,
        default: 0,
        min: 0,
        required: true}
}, {collection: "users"});

module.exports = usersSchema;