"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _auth = require('../../controllers/auth');
var _index = require('../../controllers/index');
var _cert = require('../../controllers/cert');
var _foto = require('../../controllers/foto');
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _process = require('process'); var _process2 = _interopRequireDefault(_process);

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    console.log('token a verificar:',token);
    _jsonwebtoken2.default.verify(token, _process2.default.SECRET, (err, decoded)=>{
        if(err) return res.status(401).end();

        req.client_id = decoded;
        console.log('NOME DO USUARIO decodificado: ', decoded);
        next();
    });
} 

const router = _express2.default.call(void 0, );

//router.get(/^\/$/, verifyJWT, index);
//router.get(/^\/detalhada$/, verifyJWT, index);
//router.get(/^\/sic\/api\/v1\/detalhada$/, verifyJWT, index);
//router.post(/^\/sic\/api\/v1\/detalhada$/, login);

router.get('/', verifyJWT, _index.index);
router.get('/detalhada', verifyJWT, _index.index);
router.get('/sic/api/v1/detalhada', verifyJWT, _index.index);
router.post('/sic/api/v1/detalhada', _auth.login);
router.get('/sic/api/v1/cert', _cert.cert);
router.get('/sic/api/v1/foto', _foto.foto);


module.exports = router; 
