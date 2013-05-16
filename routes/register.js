"use strict";
 
var url = require("url"),
    https = require("https"),
    http = require("http"),
    qs = require("querystring"),
    gitHubServer,
    gitHubServerProtocol;
 
exports.init = function (app) {
    gitHubServer = app.get("gitHubServer");
    gitHubServerProtocol = app.get("gitHubServerProtocol");
 
    app.get("/register", _register);
};
 
function _register(req, res) {
    var parsedUrl = url.parse(req.url, true),
        httpFunction = gitHubServerProtocol === 'http' ? http : https,
        tempCode = "INVALID",
        clientId,
        clientSecret,
        state,
        args,
        data;
 
    if (parsedUrl.query && parsedUrl.query.code) {
        tempCode = parsedUrl.query.code;
        state = parsedUrl.query.state;
        clientId = parsedUrl.query.client_id;
        clientSecret = parsedUrl.query.client_secret;
    }
 
    data = qs.stringify(
        {
            "client_id": clientId,
            "client_secret": clientSecret,
            "code": tempCode,
            "state": state
        }
    );
 
    args = {
        "host": gitHubServer,
        "method": "POST",
        "path": "/login/oauth/access_token",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": data.length
        }
    };
 
    var codeReq = httpFunction.request(args, function (codeResponse) {
        codeResponse.setEncoding('utf8');
 
        codeResponse.on('data', function (chunk) {
            var result = qs.parse(chunk),
                tokenType,
                accessToken,
                error;
 
            accessToken = result["access_token"];
            tokenType = result["token_type"];
            error = result["error"];
 
            res.render('result',
                {
                    "title": "Polyglotted Authorization Result",
                    "token": error ? "" : accessToken,
                    "type": error ? "" : tokenType,
                    "error": error || null
                }
            )
        });
 
        codeResponse.on("error", function (err) {
            console.log(err)
        });
    });
 
    codeReq.write(data);
    codeReq.end();
}
