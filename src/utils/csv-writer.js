const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = function(file_name, data, headers, type) {
    var csvHeader = [] 
    for(var [key,value] of Object.entries(headers)) {
        csvHeader.push({ id: value, title: value });
    }

    const csvWriter = createCsvWriter({
        path: file_name,
        header: csvHeader
    });

    csvWriter
    .writeRecords(data)
    .then(()=> console.log('A CSV file with details about the smells per '+type+' was generated: '+file_name));
}