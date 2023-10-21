"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _process = require('process'); var _process2 = _interopRequireDefault(_process);

async function galeria(numRG) {
    const arquivos = _fs2.default.readdirSync('/politec/sicp');
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