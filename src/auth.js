import oracledb from 'oracledb';
import { getConnection } from '../conexao.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // gerar e verificar token
import env from 'process';
//const saltRounds = 12;

const getResultset = async (conn, usuarioid ) => {
    //recupera dados do usuário no banco de dados 
    let result = await conn.execute(
        `select usuarioid,senha
         from safe.safeusuario   
            where sistemaid='SIC' and usuarioid = upper(:usuarioid)
            `, [usuarioid],
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT  } 
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

        const conn = await getConnection();

        var token;
        if((!req.body.client_id)||(!req.body.client_secret)){ 
            //console.log('Usuario ou Password não informado');
            res.status(401).end(JSON.stringify({'401' : '401 02 Não autorizado.'})); // Não autorizado        
        } 
        else {
            var user = await getResultset(conn, req.body.client_id);
            if(user===undefined){ 
                //console.log('Usuario informado não está cadastrodo no banco');
                res.status(401).end(JSON.stringify({'401' : '401 03 Não autorizado.'})); // Não autorizado        
            } 
            if(!bcrypt.compareSync(user.SENHA, req.body.client_secret)){
                //console.log('Não bateu a criptografia da senha');
                res.status(401).end(JSON.stringify({'401' : '401 04 Não autorizado.'})); // Não autorizado
            }
            else{ 
                //console.log('Usuario existe no banco e criptografia da senha bateu');
                token = jwt.sign({ "id": req.body.client_id  }, env.SECRET, {
                    expiresIn: 300 // gera um token que expira em 5 minutos
                });
            }
        }
        //console.log(token);
        res.json({ "access_token": token });
    } 
    catch(error) {
        console.log('71', error.message);
        res.status(500).end(JSON.stringify(error));
    }
}
//var teste = login('GESIST','$2a$10$hr9Db2KJWibWON1/l.DVGegJR/7pNHCAP.xYwsqSE3wVotWqvJe6C'); //uihnx
//                            $2b$10$9ZXVqEPVevAZJz1/Zkg5V.gABFaoAVg0Ehl/2qgVz1emmZjoMbyCC
module.exports = { login };
