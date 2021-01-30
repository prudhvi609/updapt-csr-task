let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companyWiseDataSchema = new Schema({
    Company : {
        type : String,
        index : true,
        required : true
    },
    Cars : {
        type : String,
        index : true
    }
});

const companyWiseDataModel = mongoose.model('CompanyWiseData',companyWiseDataSchema);

module.exports = companyWiseDataModel;