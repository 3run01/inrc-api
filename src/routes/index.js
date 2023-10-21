import Router from 'express';
import { login } from '../../controllers/auth';
import { index } from '../../controllers/index';
//import { cert } from '../../controllers/cert';
import { foto } from '../../controllers/foto';
import { todas } from '../../controllers/imagens';
import { fotos } from '../../controllers/imagens';
import jwt from 'jsonwebtoken';
import env from 'process';

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
        jwt.verify(token, env.SECRET, (err, decoded)=>{
            if(err) return res.status(401).end(JSON.stringify({'401 02' : 'Não autorizado.'}));
    
            req.client_id = decoded.id;
            console.log('USUARIOID decodificado: ', decoded.id);
            console.log(`URL solicitada: ${req.url} método: ${req.method}`);
            next();
        });
    }
} 


const router = Router();


router.get('/', verifyJWT, index);
router.post('/', login);
//router.get('/detalhada', verifyJWT, index);
//router.get('/sic/api/v1/detalhada', verifyJWT, index);
//router.get('/sic/api/v1/cert', cert);
router.get('/sic/api/v1/foto', foto);
//router.get('/sic/api/v1/imagem', todas,);
router.get('/sic/api/v1/imagem', verifyJWT, fotos);
router.post('/sic/api/v1/imagem', verifyJWT, fotos);
//router.get('/imagem', verifyJWT, todas);
router.get('/sic/api/v1/detalhada/imagem', verifyJWT, fotos);


module.exports = router; 
