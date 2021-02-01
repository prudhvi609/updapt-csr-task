let salesDataModel = require('../models/salesData.model');
let salesPriceDataModel = require('../models/salesPrice.model');
let companyWiseModel = require('../models/companyWise.model');
let zonalDataModel = require('../models/zonalDataModel.model');

let moment = require('moment');
let XLXS = require('xlsx');
let path = require('path');

let filePath = path.resolve(__dirname, '../Sample.xlsx');


class TaskOutput {
    constructor() {
    }

    static async extractExcelCreateSalesData(req, res, next) {
        try {
            let workSheet = await XLXS.readFile(filePath, { cellDates: true });
            let sheetNameList = await workSheet.SheetNames;
            let xlData = await XLXS.utils.sheet_to_json(workSheet.Sheets[sheetNameList[1]], {
                header: 1,
                // defval: '',
                blankrows: true
            });
            let removeEmptyArray = xlData.shift();
            let getHeaderRow = xlData.shift();
            for (let value of xlData) {
                let time = await moment(value[1]).local().add(1, 'minute').format().toISOString();
                let createSalesData = await salesDataModel.insertMany({
                    sNo: value[0],
                    Date: time,
                    City: value[2],
                    // CityId : value[2],
                    Car: value[3],
                    Color: value[4],
                    NumberOfVehiclesSold: value[5]
                }, (err, dataPosted) => {
                    if (!err) console.log(dataPosted);
                    else return err;

                });
            }
        }
        catch (err) {
            return err;
        }
    }

    static async extractExcelCreateSalesPrice(req, res, next) {
        try {
            let workSheet = await XLXS.readFile(filePath);
            let sheetNameList = await workSheet.SheetNames;
            let xlData = await XLXS.utils.sheet_to_json(workSheet.Sheets[sheetNameList[2]], {
                header: 1,
                // defval: '',
                blankrows: true
            });
            let removeEmptyArray = xlData.shift();
            let getHeaderRow = xlData.shift();
            let obj = {};
            for (let value of xlData) {
                let createSalesPriceData = await salesPriceDataModel.insertMany({
                    sNo: value[0],
                    City: value[1],
                    Ritz: value[2],
                    Baleno: value[3],
                    Brezza: value[4],
                    Swift: value[5],
                    Celerio: value[6],
                    Dzire: value[7],
                    Alto: value[8],
                    'Wagon R': value[9],
                    Creta: value[10],
                    Venue: value[11],
                    Santro: value[12],
                    Verna: value[13],
                    Accent: value[14],
                    'XUV 300': value[15],
                    'KUV 300': value[16],
                    'TUV 300': value[17],
                    Bolero: value[18],
                    Scorpio: value[19],
                    Fortuner: value[20],
                    Innova: value[21],
                    Etios: value[22],
                    Qualis: value[23]
                }, (err, dataPosted) => {
                    if (!err) console.log('dataPosted');
                    else return err;

                });

            }
        }
        catch (err) {
            return err;
        }
    }

    static async extractExcelCompanyWiseAndZonalCars(req, res, next) {
        try {
            let workSheet = await XLXS.readFile(filePath);
            let sheetNameList = await workSheet.SheetNames;
            let xlData3 = await XLXS.utils.sheet_to_json(workSheet.Sheets[sheetNameList[3]], {
                header: 1,
                // defval: '',
                blankrows: true
            });
            let xlData4 = await XLXS.utils.sheet_to_json(workSheet.Sheets[sheetNameList[4]], {
                header: 1,
                // defval: '',
                blankrows: true
            });
            let removeEmptyArray = xlData3.shift();
            let getHeaderRow = xlData3.shift();
            // console.log(xlData3);
            for (let value of xlData3) {
                let createCompanyWiseData = await companyWiseModel.insertMany({
                    Company: value[0],
                    Cars: value[1]
                }, (err, dataPosted) => {
                    if (!err) console.log('dataPosted');
                    else return err;
                })
            }

            let removeEmptyArray4 = xlData4.shift();
            let getHeaderRow4 = xlData4.shift();
            for (let zonalValue of xlData4) {
                let createZonalWise = await zonalDataModel.insertMany({
                    City: zonalValue[0],
                    Zone: zonalValue[1]
                }, (err, dataPosted) => {
                    if (!err) console.log('dataPosted');
                    else return err;
                })
            }
        }
        catch (err) {
            return err;
        }
    }

    /** 
     Total Number of Black cars sold from Zone A & C
    */
    static async task1(req, res, next) {
        try {
            let getZoneData = await zonalDataModel.aggregate([
                {
                    $match: {
                        $or: [
                            { Zone: "Zone C" },
                            { Zone: "Zone A" }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 0,
                        City: 1,
                        Zone: 1
                    }
                }
            ]);
            if (getZoneData) {
                let i = 0;
                var list1 = [];
                let list = {};

                for (let value of getZoneData) {
                    let getBlackCars = await salesDataModel.aggregate([
                        {
                            $match: {
                                $and: [
                                    {
                                        City: value.City
                                    }, {
                                        Color: "Black"
                                    }
                                ]
                            }
                        }, {
                            $count: "TotalCarsFromZOneAAndZoneB"
                        }
                    ]);

                    i += getBlackCars[0].TotalCarsFromZOneAAndZoneB;
                    list['totalCount'] = i;
                    list1.push(list);
                    console.log(list1);
                };
                console.log('success');
            } else console.log('error')
        }
        catch (err) {
            return err;
        }
    }

    /** 
    City wise sales trend for Maruti Suzuki Cars from January to May
    */
    static async task4(req, res, next) {
        try {
            let getCompanyWiseData = await companyWiseModel.aggregate([
                {
                    $match: {
                        Company: "Maruti Suzuki"
                    }
                },
                {
                    $project: {
                        Company: 1,
                        Cars: 1,
                        _id: 0
                    }
                }
            ]);
            // console.log(getCompanyWiseData);
            for (let cars of getCompanyWiseData) {
                // console.log(cars.Cars);
                let getSalesTrend = await salesDataModel.aggregate([
                    {
                        $match: {
                            Car: cars.Cars
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            sNo: 0
                        }
                    }
                ]);
                console.log(getSalesTrend);
            }
        }
        catch (err) {
            return err;
        }
    }

    /**
    Number of vehicles sold above the average sale value of a car. 
    (Average sale value= {No.of vehicles sold  *  Sales price}/ Total no.of vehicles sold)
    */
    static async task2(req, res, next) {
        try {
            let totalCarsSold = await salesDataModel.aggregate([
                {
                    $group: {
                        _id: null, TotalVehiclesSold: {
                            $sum: '$NumberOfVehiclesSold'
                        }
                    }
                }
            ]);
            let totalNumberOfVehiclesSold = totalCarsSold[0].TotalVehiclesSold;
            let groupByCarModel = await salesDataModel.aggregate([
                {
                    $group: {
                        _id: '$Car',
                        numberOfCars: {
                            $sum: '$NumberOfVehiclesSold'
                        }
                    }
                }
            ]);
            let joinCityModel = await salesDataModel.aggregate([
                {
                    $lookup: {
                        from: 'salespricedatas',
                        localField: 'City',
                        foreignField: 'City',
                        as: 'CityId'
                    }
                },
            ]);

            let averageSaleValue;
            let buildArray = [];
            let newObj = {};
            for (let indivCar of joinCityModel) {
                let carName = indivCar.Car;
                for (let matchCar of groupByCarModel) {
                    if (carName == matchCar._id) {
                        let NoOfVehiclesSold = matchCar.numberOfCars;
                        let salesPrice = indivCar.CityId[0][carName];
                        let NumberOfCarsIndiv = indivCar.NumberOfVehiclesSold;
                        averageSaleValue = (NumberOfCarsIndiv * salesPrice) / NoOfVehiclesSold;

                        buildArray.push(averageSaleValue);
                        console.log(buildArray);
                    }
                }
            }
        }
        catch (err) {
            return err;
        }
    }

    /**
     Provide data for Bar graph representing White car sales across the months 
     that are above the average sales value for the respective months
    */
    static async task3(req, res, next) {
        try {
            let monthStart = moment().startOf('month').format();
            let monthEnd = moment().endOf('month').format();

            const payload = {
                "year": 2021,
                "month": 1 
            }

            const from = new Date(Date.UTC(payload.year, payload.month, 1)).toISOString(); // "2019-12-01T00:00:00.000Z"
            const to = new Date(Date.UTC(payload.year, payload.month + 1, 1)).toISOString();

            let joinTablesWithSalesData = await salesDataModel.aggregate([
                {
                    $match:
                    {
                        Color: { $ne: 'White' },
                        // Date: {
                        //     $lt: to,
                        //     $gte: from,
                        // }
                    }
                },

                {
                    $lookup: {
                        from: 'companywisedatas',
                        localField: 'Car',
                        foreignField: 'Cars',
                        as: 'CarId'
                    }
                },
                {
                    $lookup: {
                        from: 'salespricedatas',
                        localField: 'City',
                        foreignField: 'City',
                        as: 'CityId'
                    }
                },
                {
                    $group: {
                        _id:
                        {
                            // 'City': '$City',
                            'Car': '$Car'
                        },
                        'NumberOfVehiclesSold': { $sum: '$NumberOfVehiclesSold' },
                        'Car': { '$first': '$Car' },
                        'City': { '$first': '$City' },
                        'Color': { '$first': '$Color' },
                        'Date': { '$first': '$Date' },
                        'CarId': { '$first': '$CarId' },
                        'CityId': { '$first': '$CityId' },
                        // 'averageSaleValue' : { $mul : ['$NumberOfVehiclesSold',`cityId.${Car}`]}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        // 'month' : {
                        //     $month : Date
                        // }
                    }
                }
            ]);
            let totalCarsSold = await salesDataModel.aggregate([
                {
                    $group: {
                        _id: null, TotalVehiclesSold: {
                            $sum: '$NumberOfVehiclesSold'
                        }
                    }
                }
            ]);
            let totalNumberOfVehiclesSold = totalCarsSold[0].TotalVehiclesSold;
            function calculateAverageSale(input) {
                var arrayNew = [];
                var subArray = [];
                var newObj = {};
                let indivSet;
                let carName;
                let NoOfVehiclesSold;
                let salesPrice;
                let averageSaleValue;
                let d;
                function func2(thingFromForLoop) {                    
                    if (arrayNew.includes(thingFromForLoop)) {
                        return arrayNew;
                    }
                    else {
                        arrayNew.push(thingFromForLoop);
                    }
                    return arrayNew;
                }

                for (indivSet of input) {
                    carName = indivSet.Car;
                    NoOfVehiclesSold = indivSet.NumberOfVehiclesSold;
                    salesPrice = indivSet.CityId[0][carName];
                    averageSaleValue = (NoOfVehiclesSold * salesPrice) / totalNumberOfVehiclesSold;
                    newObj['Car'] = indivSet.Car;
                    newObj['City'] = indivSet.City;
                    newObj['Color'] = indivSet.Color;
                    newObj['NumberOfVehiclesSold'] = indivSet.NumberOfVehiclesSold;
                    newObj['Date'] = indivSet.Date;
                    newObj['CarId'] = indivSet.CarId;
                    newObj['CityId'] = indivSet.CityId;
                    newObj['averageSaleValue'] = averageSaleValue;
                    d = func2(newObj);
                    arrayNew.push(d);
                    
                    console.log(arrayNew[0]);
                }
            }
            calculateAverageSale(joinTablesWithSalesData);

        }
        catch (err) {
            return err;
        }
    }
}

// TaskOutput.extractExcelCreateSalesData();

// TaskOutput.extractExcelCreateSalesPrice();

// TaskOutput.extractExcelCompanyWiseAndZonalCars();

// TaskOutput.task1();

// TaskOutput.task2();

// TaskOutput.task3();

TaskOutput.task4();


module.exports = TaskOutput;