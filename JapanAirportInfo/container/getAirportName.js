/* getAirportName.js
 *    Simple API running on nodejs for APIPCS.
 *  Usage:
 *    node getAirportName.js <port> <master file in CSV format>
 *  Author:
 *    Akihiro Nishikawa
 */
// First checking passed in args to take precedence

var port;
var masterFile;

if (process.argv.length === 4) {
    port = process.argv[2];
    masterFile = process.argv[3];
} else {
    // If neither port nor master file path are passed in, then will check for MOCK_PORT and MASTER_FILE env variable
    if (!process.env.MOCK_PORT && !process.env.MASTER_FILE) {
        //Cannot resolve the port or master file path
        console.log('Usage: node getAirportName.js <port> <master file path>');
        return;
    } else {
        //Port was not passed in, but env variable is set, so taking that.
        port = process.env.MOCK_PORT;
        masterFile = process.env.MASTER_FILE;
    }
}

console.log(port);
console.log(masterFile);

const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
var app = express();

// Read 3Letters Airport Info Master Data from Master file
//const fs = require('fs');
//var json = fs.readFileSync(masterFile, "utf-8");
//var airports = JSON.parse(json);
var airports=[];
csv().fromFile(masterFile)
    .on('json', (jsonObj) => { 
        airports.push(jsonObj)
    })
    .on('done', (error) => { console.log('end') });

// Accepting any type and assuming it is application/json, otherwise the caller
// is forced to pass the content-type specifically.

function defaultContentType(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

app.use(defaultContentType);
app.use(bodyParser.json({ type: '*/*' }));

//==============================================================================
//
// Look up with IATA code
//
//==============================================================================
app.get('/airports', function(req, res) {
    var response = {};
	response.airport = airports;
    res.statusCode = 200;
    res.json(response);
});


app.get('/airports/:code', function(req, res) {
    var response = {};
    var statusCode;
    var code = req.params["code"].toUpperCase();
    console.log(code);

	// If path parameter is not defined, return all airport information.
	if(code == null) {
		statusCode = 200;
		response.airport = airports;
	}
	else {
		response.airport=[];
	    for (i = 0; i < airports.length; i++) {
	        if (airports[i].Code.toUpperCase() === code) {
	            response.airport.push(airports[i]);
	            statusCode = 200;
	            break;
	        }
	    }
    }
    if (statusCode != 200) {
        // Specified IATA code is not found in master data.
        response.airport = [];
        statusCode = 200;
    }

    res.statusCode = statusCode;
    res.json(response);
});

//Creating the server process
app.listen(port);
console.log('Listening on port ' + port);
