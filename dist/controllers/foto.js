"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _process = require('process'); var _process2 = _interopRequireDefault(_process);

function verifyJWT(req,res){
    var retorno;
    if ((!req.query.token)||(req.query.token===undefined)) {
        res.status(401).end(JSON.stringify({'401 01' : 'Não autorizado.'}));
        retorno = false;
    }
    else{
        console.log('token a verificar:',req.query.token);
        _jsonwebtoken2.default.verify(req.query.token, _process2.default.SECRET, (err, decoded)=>{
            if(err) {
                res.status(401).end(JSON.stringify({'401 02' : 'Não autorizado.'}));
                retorno = false;
            }    
            else{ 
                req.client_id = decoded.id;
                console.log('USUARIOID decodificado: ', decoded.id);
                console.log(`URL solicitada: ${req.url} método: ${req.method}`);            
                retorno = true;
            }
        });
    }
    return retorno;
} 


async function foto(req,res) {
        
    console.log('marcafoto marcafoto marcafoto marcafoto marcafoto marcafoto marcafoto ');
        console.log('req.body',req.body);
        console.log('req.query',req.query);
        console.log('req.data',req.data);
        console.log('req.params',req.params);
        console.log('marcafoto marcafoto marcafoto marcafoto marcafoto marcafoto marcafoto ');

        var ok = verifyJWT(req,res);        
        if(ok===true){
            console.log('OK=',ok);
            let arquivo = await req.query.foto;
            let filepath = `/politec/sicp/${arquivo}`;
            let buff = null;
            let base64data = null;
            if(arquivo!==null){
                
                res.writeHead(200, {'Content-Type': 'image/jpg' });
                try {
                buff = _fs2.default.readFileSync(filepath);
                base64data = buff.toString('base64');
                res.write(base64data, "base64");
                }
                catch(e){
                    res.write("", "base64");
                }    
            }
        }    
        res.end();
}
module.exports = {foto};