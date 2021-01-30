let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesDataSchema = new Schema({
    sNo : {
        type : Number,
        index : true
    },
    Date : {
        type : Date,
        index : true
    },
    City : {
        type : mongoose.Schema.Types.ObjectId,
        index : true,
        ref : 'salesPriceDatas'
    },
    // CityId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'salesPriceDatas'
    // },
    Car : {
        type : String,
        index : true
    },
    Color : {
        type : String,
        index : true
    },
    NumberOfVehiclesSold : {
        type : Number,
        index : true
    }
});

const salesDataModel = mongoose.model('salesData',salesDataSchema);

module.exports = salesDataModel;