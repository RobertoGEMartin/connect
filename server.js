/**
 * Created by Rober on 09/05/15.
 */

var connect = require('connect');
connect()
    .use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);

//Middleware that does logging
function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

//Middleware that responds with “hello world”
function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) return next(new Error('Unauthorized'));
    var parts = authorization.split(' ')
    var scheme = parts[0]
    var auth = new Buffer(parts[1], 'base64').toString().split(':')
    var user = auth[0]
    var pass = auth[1];
    //        A function that checks credentials against a database
    authenticateWithDatabase(user, pass, function (err) {
        if (err) return next(err);
        next();
    });
}

function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

function authenticateWithDatabase(user,pass,callback){
    var err = null;
    callback(err);
}

//A configurable logger middleware component for Connect
function setup(format) {
    //Setup function can be called multiple times with different configurations
    //Logger  uses a regexp to match request properties
    var regexp = /:(\w+)/g;
    //Actual logger component that Connect will use
    return function logger(req, res, next) {
        //Use regexp to format log entry for request
        var str = format.replace(regexp, function (match, property) {
            return req[property];
        });
        //Print request log entry to console Pass control to next middleware component
        console.log(str);
        next();
    }
}
//Directly export logger setup function
module.exports = setup;

//Error-handling middleware in Connect
function errorHandler() {
    var env = process.env.NODE_ENV || 'development';
    return function (err, req, res, next) {
        //Error-handling middleware defines four arguments
        //errorHandler middleware component behaves differently depending on value of NODE_ENV
        ￼￼    res.statusCode = 500;
        switch (env) {
            case 'development':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server error');
        }
    }
}