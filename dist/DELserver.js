"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }const https = require('https');
const fs = require('fs');
//novas linhas
var httpProxy = require('http-proxy');
var http = require('http');
var util = require('util');
var url = require('url');

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
var _index = require('./routes/index'); var _index2 = _interopRequireDefault(_index);  

//const express = require('express');
//const bodyParser = require('body-parser');
//const router = require('./routes');  

const app = _express2.default.call(void 0, );

app.set("views", './views'); 
app.set("view engine","pug"); 

app.use(_bodyparser2.default.json());   //middlewares

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({extended: false}));

//app.use('/', (req, res, next) => {
//	console.log(`URL: ${req.url}`);
//	next();
//});

//app.get('/sic/api/v1/foto', function(req,res){
//  res.render("./routes/foto");
//});

//app.use('/sic/api/v1/foto', router);
app.use('/', _index2.default);

https.createServer({
  key: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.key'),
  cert: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.crt'),
  passphrase: 'YOUR PASSPHRASE HERE'
},app).listen(5000,function(){
  console.log('server listening in port 5000 com certificado...');
});

