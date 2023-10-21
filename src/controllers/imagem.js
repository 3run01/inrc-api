import path from 'path';
import fs from 'fs';

import jwt from 'jsonwebtoken';
import env from 'process';

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

async function imagem(req,res) {

    let numRG = await req.query.numRG;    
    let galeriarg = await galeria(numRG);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    galeriarg.forEach((arquivo)=>{
        res.writefile(`/politec/sicp/${arquivo}`);
    });
    res.end();
}
module.exports = {imagem};