let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesPriceDataSchema = new Schema({
    sNo : {
        type : Number,
        index : true
    },
    City : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ZonalDatas',
        index : true,
        required : true
    },
    Ritz : {
        type : Number,
        index : true
    },
    Baleno : {
        type : Number,
        index : true
    },
    Brezza : {
        type : Number,
        index : true
    },
    Swift : {
        type : Number,
        index : true
    },
    Celerio : {
        type : Number,
        index : true
    },
    Dzire : {
        type : Number,
        index : true
    },
    Alto : {
        type : Number,
        index : true
    },
    'Wagon R' : {
        type : Number,
        index : true
    },
    Creta : {
        type : Number,
        index : true
    },
    Venue : {
        type : Number,
        index : true
    },
    Santro : {
        type : Number,
        index : true
    },
    Verna : {
        type : Number,
        index : true
    },
    Accent : {
        type : Number,
        index : true
    },
    'XUV 300' : {
        type : Number,
        index : true
    },
    'KUV 300' : {
        type : Number,
        index : true
    },
    'TUV 300' : {
        type : Number,
        index : true
    },
    Bolero : {
        type : Number,
        index : true
    },
    Scorpio : {
        type : Number,
        index : true
    },
    Fortuner : {
        type : Number,
        index : true
    },
    Innova : {
        type : Number,
        index : true
    },
    Etios : {
        type : Number,
        index : true
    },
    Qualis : {
        type : Number,
        index : true
    },
});

const salesPriceDataModel = mongoose.model('salesPriceData',salesPriceDataSchema);

module.exports = salesPriceDataModel;