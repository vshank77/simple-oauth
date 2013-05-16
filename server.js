#!/bin/env node

var express = require("express")
    , routes = require("./routes")
    , oauth = require("./routes/oauth")
    , http = require("http")
    , path = require("path")
    , config = require("nconf")
    ;

var SampleApp = function() {

    var self = this;

    self.setupVariables = function() {
        config.defaults({
            "port"  : 8080,
            "github": {
                "host"    : "github.com",
                "protocol": "https"
            }
        });
 
        config.argv()
            .env()
            .file({file: __dirname + "/config/config.json"});
        
        self.ipaddress = process.env.OPENSHIFT_INTERNAL_IP;
        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_INTERNAL_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

        self.port = process.env.OPENSHIFT_INTERNAL_PORT || config.get("port");
    };

    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    self.setupTerminationHandlers = function(){
        process.on('exit', function() { self.terminator(); });
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.initializeServer = function() {
        self.app = express();
        
        self.app.configure(function () {
            self.app.set('port', self.port);
            self.app.set("gitHubServer", config.get("github:host"));
            self.app.set("gitHubServerProtocol", config.get("github:protocol"));
            self.app.set('views', __dirname + '/views');
            self.app.set('view engine', 'jade');
            
            self.app.use(express.favicon());
            self.app.use(express.logger('dev'));
            self.app.use(express.bodyParser());
            self.app.use(express.methodOverride());
            self.app.use(self.app.router);
            self.app.use(express.static(path.join(__dirname, 'public')));
        });
 
        self.app.configure('development', function () {
            self.app.use(express.errorHandler());
        });
 
        routes.init(self.app);
        oauth.init(self.app);
    };

    self.init = function() {
        self.setupTerminationHandlers();

        self.setupVariables();
        self.initializeServer();
    };

    self.start = function() {
        http.createServer(self.app).listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };
};

var zapp = new SampleApp();
zapp.init();
zapp.start();
