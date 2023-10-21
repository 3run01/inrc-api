"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }const https = require('https');
const fs = require('fs');
const env = require('process');
//env.SECRET = 'mysecret';
env.SECRET = 'eyJhbGciOiJQUzUxMiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0J5W09-rNx0pt5_HBiydR-vOluS6oD-RpYNa8PVWwMcBDQSXiw6-EPW8iSsalXPspGj3ouQjAnOP_4-zrlUUlvUIt2T79XyNeiKuooyIFvka3Y5NnGiOUBHWvWcWp4RcQFMBrZkHtJM23sB5D7Wxjx0-HFeNk-Y3UJgeJVhg5NaWXypLkC4y0ADrUBfGAxhvGdRdULZivfvzuVtv6AzW6NRuEE6DM9xpoWX_4here-yvLS2YPiBTZ8xbB3axdM99LhES-n52lVkiX5AWg2JJkEROZzLMpaacA_xlbUz_zbIaOaoqk8gB5oO7kI6sZej3QAdGigQy-hXiRnW_L98d4GQ';

var http = require('http');
var util = require('util');
var url = require('url');
var httpProxy = require('http-proxy');
var options = {
    target: 'sic-inrc.portal.ap.gov.br:443',
  };
  
var proxy = httpProxy.createProxyServer(options);

http.createServer(function(req, res, err) {
  
  
  if(err) console.log(err);
  var host = util.inspect(req.headers.host);
  console.log(req.connection.remoteAddress + ' asks for: ' + host + req.url);

  proxy.web(req, res, function(err) {
    if(err) console.log(err);
  });
  console.log('Awesome proxy is listening on port 433...');
}).listen(433);

//--------------------------------------------------------
/****************************************************************
 *require("dotenv-safe").config();
 *require('dotenv-safe').config({
 *    allowEmptyValues: true
 *});
 */

 //import path, { __dirname, join } from 'path';

var _express = require('express'); var _express2 = _interopRequireDefault(_express);

var _bodyparser = require('body-parser'); var _bodyparser2 = _interopRequireDefault(_bodyparser);
var _api = require('./routes/api'); var _api2 = _interopRequireDefault(_api);  
//import routeAuth from './routes/auth';  


const app = _express2.default.call(void 0, );

app.set("views", './views'); 
app.set("view engine","pug"); 

app.use(_bodyparser2.default.json());   //middlewares

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({extended: false}));

app.use('/', (req, res, next) => {
    console.log(`URL: ${req.url} Method: ${req.method}`);
    next();
});

app.use(_api2.default);       // api/index.js

https.createServer({
  key: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.key'),
  cert: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.crt'),
  passphrase: 'YOUR PASSPHRASE HERE'
},app).listen(5000,function(){
  console.log('server listening in port 5000 com certificado...');
});

