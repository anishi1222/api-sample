/* Demo4Insurance.js
     Simple Demo API running on nodejs for Insurance Industry.
   Usage:
     node Demo4Insurance.js <port>
   Author:
     Akihiro Nishikawa Wunderlich
*/
// We need the port so we will raise an alert if not given.

// First checking passed in args to take precedence
var args = process.argv.slice(2);
if (!args[0]) {
    // If the port is not passed in, then will check for MOCK_PORT env variable
    if (!process.env.MOCK_PORT) {
        //Cannot resolve the port, so raising the exception
        console.log('Usage: node server.js <port>');
        return;
    } else {
        //Port was not passed in, but env variable is set, so taking that.
        args[0] = process.env.MOCK_PORT;
    }
}

var express = require('express');
var app = express();
var port = args[0];
var bodyParser = require('body-parser');

// Our data-sets are small, so just keeping them in local variables for
// simplicity
var Products = [
    {
        "pid": "AUTO-201",
        "base_info": {
            "category": "AUTO",
            "product_name": "新○●総合自動車保険",
            "overview": "自家用車むけの総合保険です。",
            "url": "http://xxx.yyy.zz/AUTO-201"
        },
        "active": true,
        "created_at": "2015-04-01T00:00:00Z",
        "updated_at": "2015-08-27T21:33:20Z",
        "retired_at": ""
    },
    {
        "pid": "AUTO-123",
        "base_info": {
            "category": "AUTO",
            "product_name": "○●総合自動車保険",
            "overview": "自家用車むけの総合保険です。",
            "url": "http://xxx.yyy.zz/AUTO-123"
        },
        "active": false,
        "created_at": "2010-04-01T00:00:00Z",
        "updated_at": "2015-03-31T23:59:59Z",
        "retired_at": "2015-03-31T23:59:59Z"
    }
];

var Subscribers = [
    {
        "sid": "123456",
        "base_info": {
            "first_name": "花子",
            "last_name": "山田",
            "address1": "東京都港区北青山2―5―8",
            "address2": "オラクル青山センター",
            "dateofbirth": "1989-01-07T00:00:00Z"
        },
        "active": true,
        "created_at": "2015-08-27T21:33:20Z",
        "updated_at": "2015-08-27T21:33:20Z"
    },
    {
        "sid": "654321",
        "base_info": {
            "first_name": "太郎",
            "last_name": "山田",
            "address1": "東京都港区元赤坂1-3-13",
            "address2": "赤坂センタービルディング",
            "dateofbirth": "1979-01-07T00:00:00Z"
        },
        "active": true,
        "created_at": "2015-08-27T21:33:20Z",
        "updated_at": "2015-08-27T21:33:20Z"
    }
];

/* Accepting any type and assuming it is application/json, otherwise the caller
   is forced to pass the content-type specifically.
*/
function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json({ type: '*/*' }));

// /subscriber api
// 本当はsid以外のQuery Parameterが利用可能だが、デモ用途のため、sidのみ
app.get('/subscriber', function (req, res) {
    var subscriberResponse = {};
    var statusCode;
    console.log(req.query["sid"]);
    if (req.query["sid"] == null) {
        subscriberResponse.subscribers = Subscribers;
        statusCode = 200;
    }
    else {
        for (i = 0; i < Subscribers.length; i++) {
            if ((Subscribers[i].sid == req.query["sid"])) {
                break;
            }
        }
        if (i >= Subscribers.length) {
            statusCode = 404;
            subscriberResponse.message = "該当するお客様情報はありません。";
        }
        else {
            statusCode = 200;
            subscriberResponse.subscribers=[];
            subscriberResponse.subscribers.push(Subscribers[i]);
        }
    }
    res.statusCode = statusCode;
    res.json(subscriberResponse);
});

// お客様情報の変更(POST)
app.post('/subscriber', function (req, res) {
    var subscriberResponse = {};
    var statusCode;
    for (i = 0; i < Subscribers.length; i++) {
        if (Subscribers[i].sid == req.body.sid) {
            break;
        }
    }
    if (i >= Subscribers.length) {
        statusCode = 403;
        subscriberResponse.message = 'お客様情報を登録できませんでした。';
    }
    else {
        statusCode = 201;
        subscriberResponse = Subscribers[i];
        subscriberResponse.created_at = getDateTime();
        subscriberResponse.updated_at = getDateTime();
    }
    res.statusCode = statusCode;
    res.json(subscriberResponse);
});

// /subscriber api
// Path Parameterで指定
app.get('/subscriber/:sid', function (req, res) {
    var subscriberResponse = {};
    var statusCode;
    for (i = 0; i < Subscribers.length; i++) {
        if ((Subscribers[i].sid == req.params.sid)) {
            break;
        }
    }
    if (i >= Subscribers.length) {
        statusCode = 404;
        subscriberResponse.message = "該当するお客様情報はありません。";
    }
    else {
        statusCode = 200;
        subscriberResponse = Subscribers[i];
    }
    res.statusCode = statusCode;
    res.json(subscriberResponse);
});

app.put('/subscriber/:sid', function (req, res) {
    var subscriberResponse = {};
    var statusCode;
    for (i = 0; i < Subscribers.length; i++) {
        if (Subscribers[i].sid == req.params.sid) {
            break;
        }
    }
    if (i >= Subscribers.length) {
        statusCode = 404;
        subscriberResponse.message = "該当するお客様情報はありません。";
    }
    else {
        statusCode = 200;
        subscriberResponse = Subscribers[i];
        subscriberResponse.base_info = req.body;
        subscriberResponse.updated_at = getDateTime();
    }
    res.statusCode = statusCode;
    res.json(subscriberResponse);
});

app.delete('/subscriber/:sid', function (req, res) {
    var subscriberResponse = {};
    for (i = 0; i < Subscribers.length; i++) {
        if (Subscribers[i].sid == req.params.sid) {
            break;
        }
    }
    if (i >= Subscribers.length) {
        statusCode = 404;
        subscriberResponse.message = "該当するお客様情報はありません。";
    }
    else {
        subscriberResponse = Subscribers[i];
        subscriberResponse.active = false;
        subscriberResponse.updated_at = getDateTime();
        statusCode = 200;
    }
    res.statusCode = statusCode;
    res.json(subscriberResponse);
});


// /product API
// 本当はid以外のQuery Parameterが利用可能だが、デモ用途のため、idのみ
app.get('/product', function (req, res) {
    var productResponse = {};
    var statusCode;
    console.log(req.query["pid"]);
    if (req.query["pid"] == null) {
        productResponse.products = Products;
        statusCode = 200;
    }
    else {
        for (i = 0; i < Products.length; i++) {
            if ((Products[i].pid == req.query["pid"])) {
                break;
            }
        }
        if (i >= Products.length) {
            statusCode = 404;
            productResponse.message = "該当する保険商品情報はありません。";
        }
        else {
            statusCode = 200;
            productResponse.products=[];
            productResponse.products.push(Products[i]);
        }
    }
    res.statusCode = statusCode;
    res.json(productResponse);
});

// 保険商品情報の追加(POST)
app.post('/product', function (req, res) {
    var productResponse = {};
    var statusCode;
    for (i = 0; i < Products.length; i++) {
        if (Products[i].pid == req.body.pid) {
            break;
        }
    }
    if (i >= Products.length) {
        statusCode = 403;
        productResponse.message = '保険商品情報を登録できませんでした。';
        res.json(productResponse);
    }
    else {
        statusCode = 201;
        productResponse = Products[i];
        productResponse.active = true;
        productResponse.created_at = getDateTime();
        productResponse.updated_at = getDateTime();
        productResponse.retired_at = "";
    }
    res.statusCode = statusCode;
    res.json(productResponse);
});

// /product api
// Path Parameterで指定
app.get('/product/:pid', function (req, res) {
    var productResponse = {};
    var statusCode;
    for (i = 0; i < Products.length; i++) {
        if ((Products[i].pid == req.params.pid)) {
            break;
        }
    }
    console.log(i);
    if (i >= Products.length) {
        statusCode = 404;
        productResponse.message = "条件に該当する保険商品情報はありません。";
    }
    else {
        statusCode = 200;
        productResponse = Products[i];
    }
    res.statusCode = statusCode;
    res.json(productResponse);
});

app.put('/product/:pid', function (req, res) {
    var productResponse = {};
    var statusCode;
    for (i = 0; i < Products.length; i++) {
        if (Products[i].pid == req.params.pid) {
            break;
        }
    }
    if (i >= Products.length) {
        statusCode = 404;
        productResponse.message = "条件に該当する保険商品情報がないため、変更できませんでした。";
    }
    else {
        statusCode = 200;
        productResponse = Products[i];
        productResponse.base_info = req.body;
        productResponse.updated_at = getDateTime();
    }
    res.statusCode = statusCode;
    res.json(productResponse);
});

app.delete('/product/:pid', function (req, res) {
    var productResponse = {};
    var statusCode;
    for (i = 0; i < Products.length; i++) {
        if (Products[i].pid == req.params.pid) {
            break;
        }
    }
    if (i >= Products.length) {
        statusCode = 404;
        productResponse.message = "条件に該当する保険商品情報がないため、変更できませんでした。";
    }
    else {
        statusCode = 200;
        productResponse = Products[i];
        productResponse.updated_at = getDateTime();
        productResponse.retired_at = getDateTime();
        productResponse.active = false;
    }
    res.statusCode = statusCode;
    res.json(productResponse);
});

function getDateTime() {
    var format = 'YYYY-MM-DDThh:mm:ss';
    date = new Date();
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format+"Z";
    return format;
};

//Creating the server process
app.listen(port);
console.log('Listening on port ' + port);
