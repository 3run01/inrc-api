import fs from 'fs';
//const fs = require('fs');

import jwt from 'jsonwebtoken';
import env from 'process';

function verifyJWT(req, res){

    if ((!req.query.token)||(req.query.token===undefined)) {
        return res.status(401).end(JSON.stringify({'401 05' : 'Não autorizado.'}));
    }
    else{
        const token = req.query.token;
        console.log('token a verificar:',token);
        jwt.verify(token, env.SECRET, (err, decoded)=>{
            if(err) return res.status(401).end(JSON.stringify({'401 06' : 'Não autorizado.'}));
    
            req.client_id = decoded.id;
            console.log('USUARIOID decodificado: ', decoded.id);
            console.log(`URL solicitada: ${req.url} método: ${req.method}`);            
            return true;
        });
    }
} 




async function galeria(numRG) {
    const arquivos = fs.readdirSync('/politec/sicp');
    let i = -1, galeria=[];
    arquivos.map((arquivo)=>{
      let result = arquivo.indexOf(numRG);
      if(result>=0){
        i = i+1;
        galeria[i]=arquivo;
        arquivos.slice(result,1);
      }
    });
    return galeria; 
}

async function todas(req,res) {
//async function todas(numRG) {
    verifyJWT(req, res);
    let numRG = await req.query.numRG;    
    let galeriarg = await galeria(numRG);
    let imagens = {};
    if(galeriarg.length>0){
        res.writeHead(200, {'Content-Type': 'application/json' });
        galeriarg.map((arquivo,index) => {
           imagens[index]=arquivo; // nome
           imagens[index]=(!req.headers['x-access-token'])? 
           `https://sic-inrc.portal.ap.gov.br/sic/api/v1/detalhada/foto?foto=${arquivo}&token=${req.body.token_local}`
           :`https://sic-inrc.portal.ap.gov.br/sic/api/v1/detalhada/foto?foto=${arquivo}&token=${req.headers['x-access-token']}`;
       });
    }
    res.status(200).end(`${JSON.stringify(imagens)}`);

}

async function fotos(req,res) {

    console.log('marca marca marca marca marca marca marca marca marca marca marca marca marca ');
    console.log('req.body',req.body);
    console.log('req.query',req.query);
    console.log('req.data',req.data);
    console.log('req.params',req.params);
    console.log('req.headers[x-access-token]',req.headers['x-access-token']);
    console.log('marca marca marca marca marca marca marca marca marca marca marca marca marca ');
    let numRG = await req.query.numRG;    
    let galeriarg = await galeria(numRG);
    let imagens = {};
    if(galeriarg.length>0){
        galeriarg.map((arquivo,index) => {
            imagens[index]=arquivo; // nome
            imagens[index]=(!req.headers['x-access-token'])? 
            `https://sic-inrc.portal.ap.gov.br/sic/api/v1/detalhada/foto?foto=${arquivo}&token=${req.body.token_local}`
            :`https://sic-inrc.portal.ap.gov.br/sic/api/v1/detalhada/foto?foto=${arquivo}&token=${req.headers['x-access-token']}`;
        });
    }
    
    res.render('foto/index', {imagens} );

}
    
module.exports = { todas, fotos };
