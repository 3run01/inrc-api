import Router from 'express';
//------------------------------------------
import { index } from '../controllers/index';
import { foto } from '../controllers/foto';
import { cert } from '../controllers/cert';

const router = Router();
router.get('/', index);
router.post('/', index);
router.get('/foto', foto);
router.get('/cert', cert);
router.get('/sic/api/v1/detalhada', index);
router.post('/sic/api/v1/detalhada', index);
router.get('/sic/api/v1/foto', foto);
router.get('/sic/api/v1/cert', cert);
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