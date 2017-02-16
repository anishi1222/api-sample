/* Demo4OracleTravel.js
     Simple Demo API running on nodejs for APIPCS event on February 10, 2017.
   Usage:
     node Demo4OracleTravel.js <port>
   Author:
     Akihiro Nishikawa
*/
// We need the port so we will raise an alert if not given.

// First checking passed in args to take precedence
var args = process.argv.slice(2);
if (!args[0]) {
    // If the port is not passed in, then will check for MOCK_PORT env variable
    if (!process.env.MOCK_PORT) {
        //Cannot resolve the port, so raising the exception
        console.log('Usage: node Demo4OracleTravel.js <port>');
        return;
    } else {
        //Port was not passed in, but env variable is set, so taking that.
        args[0] = process.env.MOCK_PORT;
    }
}

var uuidV4 = require('uuid/v4');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = args[0];

// Hotel master data
var Hotels = [
    {
        "hotelId": "H0001",
        "name": "オラクルホテル青山",
        "url": "http://www.oracle.com/jp",
        "country": "JP",
        "pref": "13",
        "city": "13013",
        "region": "青山",
        "address": "東京都港区青山2-5-8",
        "comment": "新しい、清潔なホテルです。全館禁煙です。",
        "in": "15:00",
        "out": "12:00",
        "rooms": [
            {
                "roomId": "H0001-R001",
                "name": "シングル（禁煙）",
                "smokable": false,
                "fee": 8000,
                "unit": "JPY",
                "info": "ダブルベッド、30m2のお部屋です。"
            },
            {
                "roomId": "H0001-R001",
                "name": "ツイン（禁煙）",
                "smokable": false,
                "fee": 12000,
                "unit": "JPY",
                "info": "ツインベッド、40m2のお部屋です。"
            },
            {
                "roomId": "H0001-R002",
                "name": "スイート（禁煙）",
                "smokable": false,
                "fee": 24000,
                "unit": "JPY",
                "info": "80m2のスイートルームです。"
            }
        ]
    },
    {
        "hotelId": "H0002",
        "name": "アイランドリゾート・ラナイ",
        "url": "http://int.gohawaii.com/jp/lanai/",
        "country": "US",
        "pref": "99",
        "city": "99999",
        "region": "ハワイ",
        "address": "ハワイ州ラナイ島",
        "comment": "全島ホテルの敷地です。外界とのつながりを絶って、のんびり過ごすことができるコテージ仕様です。全館禁煙です。",
        "in": "15:00",
        "out": "12:00",
        "rooms": [
            {
                "roomId": "H0002-R001",
                "name": "ツイン（禁煙）",
                "smokable": false,
                "fee": 300,
                "unit": "USD",
                "info": "ツインベッド、60m2のお部屋です。"
            },
            {
                "roomId": "H0002-R002",
                "name": "ファミリー（禁煙）",
                "smokable": false,
                "fee": 400,
                "unit": "USD",
                "info": "ファミリー仕様、4ベッドです（80m2）。"
            },
            {
                "roomId": "H0002-R003",
                "name": "スペシャルスィート（禁煙）",
                "smokable": false,
                "fee": 500,
                "unit": "USD",
                "info": "ウェルカムドリンク、ウェルカムスィーツ付き、広々とした部屋でのんびりお過ごしください（120m2）。"
            }
        ]
    },
    {
        "hotelId": "H0003",
        "name": "何有荘",
        "url": "http://www.kaarisou.com/jp/",
        "country": "JP",
        "pref": "26",
        "city": "26103",
        "region": "南禅寺",
        "address": "京都府京都市左京区南禅寺",
        "comment": "南禅寺近くの日本家屋の旅館です。全館禁煙です。",
        "in": "15:00",
        "out": "12:00",
        "rooms": [
            {
                "roomId": "H0003-R001",
                "name": "和室（禁煙）",
                "smokable": false,
                "fee": 25000,
                "unit": "JPY",
                "info": "日本家屋の離れです。"
            }
        ]
    }
];

// Hotel booking info　（Transaction Data）
var BookInfo = [];

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
// ホテルの検索
//
//==============================================================================
app.get('/hotels', function (req, res) {
    var hotelInfoResponse = {};
    var tempResponse = {};
    var subseqOperationFlag = true;
    var statusCode;
    console.log(req.query["country"]);
    console.log(req.query["pref"]);
    console.log(req.query["city"]);
    console.log(req.query["region"]);
    console.log(req.query["name"]);
    console.log(req.query["in"]);
    console.log(req.query["out"]);
    console.log(req.query["min"]);
    console.log(req.query["max"]);

    // 全件出力
    if (req.query["country"] == null && req.query["name"] == null &&
        req.query["pref"] == null && req.query["in"] == null &&
        req.query["city"] == null && req.query["out"] == null &&
        req.query["region"] == null && req.query["min"] == null &&
        req.query["max"] == null) {
        hotelInfoResponse.result = [];
        hotelInfoResponse.result = Hotels;
        statusCode = 200;
    }
    else {
        tempResponse.result = [];

        // 国コードで検索
        if (req.query["country"] != null && subseqOperationFlag ) {
            for (i = 0; i < Hotels.length; i++) {
                if (Hotels[i].country === req.query["country"]) {
                    tempResponse.result.push(Hotels[i]);
                }
            }
            // 検索結果の件数がゼロなら、後続の処理はしない
            if(tempResponse.result.length < 1) {
                subseqOperationFlag = false;
            }
        }

        // 都道府県コードで検索
        if ( req.query["pref"] != null && subseqOperationFlag ) {
            if(tempResponse.result.length < 1) {
                // 何も指定がない場合
                for (i = 0; i < Hotels.length; i++) {
                    if (Hotels[i].pref === req.query["pref"]) {
                        tempResponse.result.push(Hotels[i]);
                    }
                }
            }
            else {
                // 既に検索結果がある場合
                for(i = tempResponse.result.length - 1 ; i >=0 ; i-- ) {
                    if(tempResponse.result[i].pref !== req.query["pref"] ) {
                        tempResponse.result.splice(i,1);
                    }
                }
            }
            // 検索結果の件数がゼロなら、後続の処理はしない
            if(tempResponse.result.length < 1) {
                subseqOperationFlag = false;
            }
        }

        // 市区町村コードで検索
        if ( req.query["city"] != null && subseqOperationFlag ) {
            if(tempResponse.result.length < 1) {
                // 何も指定がない場合
                for (i = 0; i < Hotels.length; i++) {
                    if (Hotels[i].city === req.query["city"]) {
                        tempResponse.result.push(Hotels[i]);
                    }
                }
            }
            else {
                // 既に検索結果がある場合
                for(i = tempResponse.result.length - 1 ; i >=0 ; i-- ) {
                    if(tempResponse.result[i].city !== req.query["city"] ) {
                        tempResponse.result.splice(i,1);
                    }
                }
            }
            // 検索結果の件数がゼロなら、後続の処理はしない
            if(tempResponse.result.length < 1) {
                subseqOperationFlag = false;
            }
        }

        // 地域コードで検索
        if ( req.query["region"] != null && subseqOperationFlag ) {
            if(tempResponse.result.length < 1) {
                // 何も指定がない場合
                for (i = 0; i < Hotels.length; i++) {
                    if (Hotels[i].region === req.query["region"]) {
                        tempResponse.result.push(Hotels[i]);
                    }
                }
            }
            else {
                // 既に検索結果がある場合
                for(i = tempResponse.result.length - 1 ; i >=0 ; i-- ) {
                    if(tempResponse.result[i].region !== req.query["region"] ) {
                        tempResponse.result.splice(i,1);
                    }
                }
            }
            // 検索結果の件数がゼロなら、後続の処理はしない
            if(tempResponse.result.length < 1) {
                subseqOperationFlag = false;
            }
        }

        if ( subseqOperationFlag ) {
            // 検索結果が1件以上存在する場合
            statusCode = 200;
            hotelInfoResponse = tempResponse;
        } else {
            // 後続の処理がない、ということは、ゼロ件。
            statusCode = 404;
            hotelInfoResponse.code = "404";
            hotelInfoResponse.info = "条件にあうホテルはありません。";
        }
    }
    res.statusCode = statusCode;
    res.json(hotelInfoResponse);
});

//==============================================================================
//
// ホテル予約の検索 (Booking IDで検索)
// 
//==============================================================================
app.get('/hotels/reservation', function (req, res) {
    var bookInfoResponse = {};
    var statusCode;
    console.log(req.query[":bookingId"]);
    if (req.query["bookingId"] == null) {
        statusCode = 403;
        bookInfoResponse.code = "403";
        bookInfoResponse.info = "予約IDがない検索はできません。";
    }
    else {
        for (i = 0; i < BookInfo.length; i++) {
            if ((BookInfo[i].bookingId == req.query["bookingId"])) {
                statusCode = 200;
                bookInfoResponse = BookInfo[i];
                break;
            }
        }
        if (i >= BookInfo.length) {
            statusCode = 404;
            bookInfoResponse.code = "404";
            bookInfoResponse.info = "指定された予約IDに該当する予約はありません。";
        }
    }
    res.statusCode = statusCode;
    res.json(bookInfoResponse);
});

//==============================================================================
//
// 宿泊予約(POST)
// 
//==============================================================================

app.post('/hotels/reservation', function (req, res) {
    var bookItem = {};
    var bookResponse = {};

    // 折り返しの情報などを指定しておく
    bookResponse.bookindId = uuidV4();
    bookResponse.tx_id = req.body.tx_id;
    console.log(bookResponse);
    console.log(req.body);

    bookItem.bookingId = bookResponse.bookindId;
    bookItem.inDateTime = req.body.inDateTime;
    bookItem.outDatetime = req.body.outDatetime;
    bookItem.roomId = req.body.roomId;
    bookItem.NumOfAdult = req.body.NumOfAdult;
    bookItem.NumOfChild = req.body.NumOfChild;
    bookItem.guestInfo = req.body.guestInfo;

    BookInfo.push(bookItem);
    res.statusCode = 201;
    res.json(bookResponse);
});

//Creating the server process
app.listen(port);
console.log('Listening on port ' + port);
