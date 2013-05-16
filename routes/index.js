var clientId,
    gitHubServer,
    gitHubServerProtocol;
 
exports.init = function(app) {
    gitHubServer = app.get("gitHubServer");
    gitHubServerProtocol = app.get("gitHubServerProtocol");
    app.get("/", _index);
};
 
function _index(req, res) {
    res.render('index',
        {
            "title": 'GitHub Authorization Registration',
            "state": new Date().getTime(),
            "gitHubServer": gitHubServer,
            "gitHubServerProtocol": gitHubServerProtocol
        }
    );
}
