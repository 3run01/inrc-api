"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _oracledb = require('oracledb'); var _oracledb2 = _interopRequireDefault(_oracledb);
var _conexaojs = require('../conexao.js');
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);  // gerar e verificar token
var _process = require('process'); var _process2 = _interopRequireDefault(_process);
//const saltRounds = 12;

const getResultset = async (conn, usuarioid ) => {
    //recupera dados do usuário no banco de dados 
    let result = await conn.execute(
        `select usuarioid,senha
         from safe.safeusuario   
            where sistemaid='SIC' and usuarioid = upper(:usuarioid)
            and client_secret is not null`, [usuarioid],
        { resultSet: true, outFormat: _oracledb2.default.OUT_FORMAT_OBJECT  } 
    );
    const row = await result.resultSet.getRow();
    if(row===undefined){
        return {USUARIOID:null,SENHA:null};
    }else{
        return row;
    }      
};



//** Retorna o token  */
async function login(req, res) {
    
    console.log('35 cliente_id:',req.body.client_id);
    console.log('36 cliente_secret:',req.body.client_secret);
    try {

        const conn = await _conexaojs.getConnection.call(void 0, );

        var token;
        if((!req.body.client_id)||(!req.body.client_secret)){ 
            //console.log('Usuario ou Password não informado');
            //res.status(401).end(JSON.stringify({'401' : '401 00 Usuario Nao autorizado.'})); // sem Usuário/senha 
            res.json({ status:401, statusText:'401 00 Usuário Nao autorizado.' }).end();       
        } 
        else {
            var user = await getResultset(conn, req.body.client_id);
            console.log('37 user:',user);
            if(user.USUARIOID===undefined||user.USUARIOID===null){ 
                console.log('38 - Usuario não está cadastrodo ou nao está autorizado');
                //res.status(401).end(JSON.stringify({'401' : '401 02 Usuario Nao autorizado.'})); // Usuário Não Cadastrdo ou Não Autorizado        
                res.json({ status:401, statusText:'401 02 Usuario Nao autorizado.' }).end();       
            }else 
            if(!_bcrypt2.default.compareSync(user.SENHA, req.body.client_secret)){
                //console.log('Não bateu a criptografia da senha');
                //res.status(401).end(JSON.stringify({'401' : '401 03 Ususario Nao autorizado.'})); // Token vencido
                res.json({ status:401, statusText:'401 03 Token expirado.' }).end();       
            }
            else{ 
                //console.log('Usuario existe no banco e criptografia da senha bateu');
                token = _jsonwebtoken2.default.sign({ "id": req.body.client_id  }, _process2.default.SECRET, {
                    expiresIn: 300 // gera um token que expira em 5 minutos
                });
                res.json({ "access_token": token }).end();
            }
        }
        //console.log(token);
        //res.json({ "access_token": token }).end();
    } 
    catch(error) {
        console.log('71', error.message);
        //res.status(500).end(JSON.stringify(error));
        res.json({ status:500,statusText:'error 500'}).end();
    }
}
//var teste = login('GESIST','$2a$10$hr9Db2KJWibWON1/l.DVGegJR/7pNHCAP.xYwsqSE3wVotWqvJe6C'); //uihnx
//                            $2b$10$9ZXVqEPVevAZJz1/Zkg5V.gABFaoAVg0Ehl/2qgVz1emmZjoMbyCC
module.exports = { login };
