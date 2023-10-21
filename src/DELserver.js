const https = require('https');
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
 import express from 'express';

import  bodyParser from 'body-parser';
import router from './routes/index';  

//const express = require('express');
//const bodyParser = require('body-parser');
//const router = require('./routes');  

const app = express();

app.set("views", './views'); 
app.set("view engine","pug"); 

app.use(bodyParser.json());   //middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//app.use('/', (req, res, next) => {
//	console.log(`URL: ${req.url}`);
//	next();
//});

//app.get('/sic/api/v1/foto', function(req,res){
//  res.render("./routes/foto");
//});

//app.use('/sic/api/v1/foto', router);
app.use('/', router);

https.createServer({
  key: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.key'),
  cert: fs.readFileSync('/etc/apache2/certificados/portal_ap_gov_br.crt'),
  passphrase: 'YOUR PASSPHRASE HERE'
},app).listen(5000,function(){
  console.log('server listening in port 5000 com certificado...');
});

