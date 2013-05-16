"use strict";
 
var url = require("url"),
    gitHubServer,
    gitHubServerProtocol;
 
exports.init = function (app) {
    app.get("/oauth", _oauth);
};
 
function _oauth(req, res) {
    var parsedUrl = url.parse(req.url, true),
        code = "INVALID",
        state;
 
    if (parsedUrl.query && parsedUrl.query.code) {
        code = parsedUrl.query.code;
        state = parsedUrl.query.state;
    }

    res.render('oauth',
        {
            "title": 'GitHub Authorization Retrieval',
            "code": code,
            "state": state
        }
    );
}

