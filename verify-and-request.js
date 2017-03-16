var request_lib = require('request');
var verifyer = require('./src/api_verification.js');
exports.addDefinition = verifyer.addDefinition;
exports.get = function (data, callback) {
    console.log("intercepted GET request");
    var allData = {};
    allData = Object.assign(allData, data.form);
    allData = Object.assign(allData, data.qs);
    verifyer.verify(data.url, "GET", allData);
    return request_lib.get(data, callback);
};
exports.post = function (data, callback) {
    console.log("intercepted POST request");
    var allData = {};
    allData = Object.assign(allData, data.form);
    allData = Object.assign(allData, data.qs);
    verifyer.verify(data.url, "POST", allData);
    return request_lib.post(data, callback);
};
