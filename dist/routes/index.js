"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _auth = require('../../controllers/auth');
var _index = require('../../controllers/index');
//import { cert } from '../../controllers/cert';
var _foto = require('../../controllers/foto');
var _imagens = require('../../controllers/imagens');

var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _process = require('process'); var _process2 = _interopRequireDefault(_process);

function verifyJWT(req, res, next){
    var token;
    console.log('req.body',req.body);
    console.log('req.query',req.query);
    console.log('req.data',req.data);
    console.log('req.params',req.params);
   if (((!req.headers['x-access-token'])||(req.headers['x-access-token']===undefined)) 
    &((!req.body.token_local)||(req.body.token_local===undefined))) {
        return res.status(401).end(JSON.stringify({'401 01' : 'Não autorizado...'}));
    }
    else{
        
        if (req.headers['x-access-token'])
        {
            token = req.headers['x-access-token'];    
        }
        if (req.body.token_local)
        {
            token = req.body.token_local;    
        }
        console.log('token a verificar:',token);
        _jsonwebtoken2.default.verify(token, _process2.default.SECRET, (err, decoded)=>{
            if(err) return res.status(401).end(JSON.stringify({'401 02' : 'Não autorizado.'}));
    
            req.client_id = decoded.id;
            console.log('USUARIOID decodificado: ', decoded.id);
            console.log(`URL solicitada: ${req.url} método: ${req.method}`);
            next();
        });
    }
} 


const router = _express2.default.call(void 0, );


router.get('/', verifyJWT, _index.index);
router.post('/', _auth.login);
//router.get('/detalhada', verifyJWT, index);
//router.get('/sic/api/v1/detalhada', verifyJWT, index);
//router.get('/sic/api/v1/cert', cert);
router.get('/sic/api/v1/foto', _foto.foto);
//router.get('/sic/api/v1/imagem', todas,);
router.get('/sic/api/v1/imagem', verifyJWT, _imagens.fotos);
router.post('/sic/api/v1/imagem', verifyJWT, _imagens.fotos);
//router.get('/imagem', verifyJWT, todas);
router.get('/sic/api/v1/detalhada/imagem', verifyJWT, _imagens.fotos);


module.exports = router; 
