let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zonalDataSchema = new Schema({
    City : {
        type : String,
        index : true,
        required : true
    },
    Zone : {
        type : String,
        index : true
    }
});

const zonalDataModel = mongoose.model('ZonalData',zonalDataSchema);

module.exports = zonalDataModel;