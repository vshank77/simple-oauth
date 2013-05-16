var clientId,
    gitHubServer,
    gitHubServerProtocol;
 
exports.init = function(app) {
    clientId = app.get("clientId");
    gitHubServer = app.get("gitHubServer");
    gitHubServerProtocol = app.get("gitHubServerProtocol");
    app.get("/", _index);
};
 
function _index(req, res) {
    res.render('index',
        {
            "title": 'Polyglotted Authorization Registration',
            "client_id": clientId,
            "state": new Date().getTime(),
            "gitHubServer": gitHubServer,
            "gitHubServerProtocol": gitHubServerProtocol
        }
    );
}