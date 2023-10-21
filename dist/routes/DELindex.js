"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
//------------------------------------------
var _index = require('../controllers/index');
var _foto = require('../controllers/foto');
var _cert = require('../controllers/cert');

const router = _express2.default.call(void 0, );
router.get('/', _index.index);
router.post('/', _index.index);
router.get('/foto', _foto.foto);
router.get('/cert', _cert.cert);
router.get('/sic/api/v1/detalhada', _index.index);
router.post('/sic/api/v1/detalhada', _index.index);
router.get('/sic/api/v1/foto', _foto.foto);
router.get('/sic/api/v1/cert', _cert.cert);
//router.get('/api/v1/consulta', verifyJWT, getRg);

module.exports = router; 


/**
const router = Router();
router.get('/', index);
router.post('/', index);
router.post('/detalhada', index);
router.get('/foto/:arquivo', foto);
router.get('/cert/:arquivo', cert);
router.get('/sic/api/v1/detalhada', index);
router.post('/sic/api/v1/detalhada', index);
router.get('/sic/api/v1/foto/:arquivo', foto);
router.get('/sic/api/v1/cert/:arquivo', cert);
//router.get('/api/v1/consulta', verifyJWT, getRg);
 
module.exports = router;  
*/