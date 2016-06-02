// collections.js

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    postedBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

// create a schema
var collectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    org:{
        type: String,
        default: ''
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Collections = mongoose.model('Collection', collectionSchema);

// make this available to our Node applications
module.exports = Collections;