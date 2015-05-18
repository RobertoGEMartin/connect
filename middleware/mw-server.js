/**
 * Created by Rober on 18/05/15.
 */

//Middleware for parsing cookies, request bodies,and query strings

var connect = require('connect');
var app = connect()
    .use(connect.cookieParser('tobi is a cool ferret'))
    .use(function(req, res){
        console.log(req.cookies);
        console.log(req.signedCookies);
        res.end('hello\n');
    }).listen(3000);