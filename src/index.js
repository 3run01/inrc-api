import Router from 'express';
import { login } from '../../controllers/auth';
import { index } from '../../controllers/index';
import { cert } from '../../controllers/cert';
import { foto } from '../../controllers/foto';
import jwt from 'jsonwebtoken';
import env from 'process';

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    console.log('token a verificar:',token);
    jwt.verify(token, env.SECRET, (err, decoded)=>{
        if(err) return res.status(401).end();

        req.client_id = decoded;
        console.log('NOME DO USUARIO decodificado: ', decoded);
        next();
    });
} 

const router = Router();

//router.get(/^\/$/, verifyJWT, index);
//router.get(/^\/detalhada$/, verifyJWT, index);
//router.get(/^\/sic\/api\/v1\/detalhada$/, verifyJWT, index);
//router.post(/^\/sic\/api\/v1\/detalhada$/, login);

router.get('/', verifyJWT, index);
router.get('/detalhada', verifyJWT, index);
router.get('/sic/api/v1/detalhada', verifyJWT, index);
router.post('/sic/api/v1/detalhada', login);
router.get('/sic/api/v1/cert', cert);
router.get('/sic/api/v1/foto', foto);


module.exports = router; 
