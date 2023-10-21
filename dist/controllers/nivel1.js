"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }//import {listar} from '../../repository/nivel1.js';
//import { Console } from 'console';
var _requisicoes = require('../requisicoes');
var _conexao = require('../conexao');
var _oracledb = require('oracledb'); var _oracledb2 = _interopRequireDefault(_oracledb);
var _console = require('console');
var binds=[], result=null;
var mensagem=[];
var arrFiliacao;
const getResultset = async (idUsuario,cpfUsuario, sistemaOrigem ) => {
    //recupera dados do usuário no banco de dados 
    const conn = await _conexao.getConnection.call(void 0, );
    
    let result = await conn.execute(
        `select usuarioid,senha,client_secret,cpf,nome 
         from safe.safeusuario   
            where sistemaid='SIC' and client_secret is not null 
            and usuarioid = upper(:idUsuario)
            and cpf = :cpfUsuario
            and aplicativo = upper(:sistemaOrigem)
            `, [idUsuario, cpfUsuario, sistemaOrigem],
        { resultSet: true, outFormat: _oracledb2.default.OUT_FORMAT_OBJECT  } 
    );
    const row = await result.resultSet.getRow();
    await conn.close();
    if(row===undefined){
        return {USUARIOID:null, CPF:null,NOME:null};
    }else{
        return row;
    }      
};

function consiste(parametros){
    let msg=[],i=0;

    if(parametros.idUsuario==undefined){
        msg[i]={'campo':'idUsuario','mensagem':'Nao foi informado'};
        i=i+1;
    }else if(parametros.idUsuario==''){ 
        msg[i]={'campo':'idUsuario','mensagem':'É de preenchimento obrigatorio'};
        i=i+1;
    }

    if(parametros.cpfUsuario==undefined){
        msg[i]={'campo':'cpfUsuario','mensagem':'Nao foi informado'};
        i=i+1;
    }else if(parametros.cpfUsuario==''){ 
        msg[i]={'campo':'cpfUsuario','mensagem':'É de preenchimento obrigatorio'};
        i=i+1;
    }
    if(parametros.sistemaOrigem==undefined){
        msg[i]={'campo':'sistemaOrigem','mensagem':'Nao foi informado'};
        i=i+1;
    }else if(parametros.sistemaOrigem==''){ 
        msg[i]={'campo':'sistemaOrigem','mensagem':'É de preenchimento obrigatorio'};
        i=i+1;
    }


    if(msg.length>0){ 
        return [msg, false];
    }else{
        return [[], true];
    }
}

async function nivel1(req, res) {

    console.log('*****************************************************');
    console.log(req.body);
    console.log('*****************************************************');
    
   

    

    //const conn = await getConnection();
    
    
/*     if(typeof(conn)==='string') {
        console.log('sem conexao com o banco de dados....');
        let resp={};mensagem=[];
        resp.status=400;
        resp.statusText='Sem conexão de banco de dados';
        resp.dados=mensagem[0];
        console.log(resp);
        //res.render('envio/index',resp);
        console.log('server listening in port 3001');
        res.end();
    } 
    else {
 */
        //var tabela = `${req.body.idUsuario}`;
        //result = await conn.execute(`Begin INRC_DINAMICA('${tabela}'); End;`);
        //console.log('criou tabela dinamica');
        //const sqldel = `DELETE FROM TEMP${req.body.idUsuario} WHERE RG LIKE :X`;
        //const bindsdel = [
        //  ['%'],
        //];
        //const optionsdel = { dmlRowCounts: true, autoCommit: true, };
        //result = await conn.executeMany(sqldel, bindsdel, optionsdel);
        //console.log('deletou da tabele dinamica');




        var msg,bol;
        [msg,bol]=consiste(req.body);     
        
        if(bol===true) {
            var userdb = await getResultset(req.body.idUsuario,req.body.cpfUsuario,req.body.sistemaOrigem);
            console.log('usuarioDB:', userdb);
            if(userdb.USUARIOID!==null) {
                const https = require('https');
                let params = req.body; 
                params.nomeUsuario = userdb.NOME; 
                let token = await _requisicoes.pegaAuth.call(void 0, );
                const config = {
                    //headers:{'consumerId':'INRC-AP', 'Content-Type':'application/json', 'Authorization': `Bearer ${pgAuth.data.access_token}`, },
                    json: 'true',
                    validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                    },
                };
                const axios = require("axios").default;
                const qs = require('qs');
                var options = {
                    method: 'GET',
                    url: 'https://homologacao.apigateway.pr.gov.br/inrc/consulta/api/v1/cidadao',
                    headers: {
                        consumerId: 'INRC-AP',
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${token.data.access_token}`,
                    },
                    params: req.body,
                };
                //console.log('options options options options options options options options options options options ');
                console.log(options);
                //console.log('options options options options options options options options options options options ');
                const postando = new Promise(( tudobem, opps ) => { 
            
                    axios.request(options)
                    .then((response)=>{
                            //console.log(response.status,response.statusText,response.data);
                            //return tudobem(data);
                            return tudobem(response);
                        })
                    .catch((error)=>{
                            //console.log('Error 224:',error);
                            return tudobem(error.response);
                        });
            
                })
                .then(async(response)=>{
                    console.log('status:',response.status);
                    console.log('statusText',response.statusText);
                    console.log('data',response.data);
                    let resp = {'status': await response.status,'statusText': await response.statusText,'data': await response.data}; 
                    if(resp.status>=400 && resp.status<=500) {
                        //res.statusCode=200;
                        //res.send(`${resp.status} - ${resp.message}`);
                        await conn.close();
                        console.log('server listening in port 3001');
                        res.status(resp.status).json({ status:resp.status, statusText:resp.statusText,data:resp.data }).end();
                        //resp.statusText=await response.data;
                        //resp.data=[];
                        //console.log(resp);
                        //res.render('consulta/index', resp);
                    }
                    else{
                        //console.log('resolvido 128::',resp.data);
                        if(resp.data===''){
                            resp.status=404;
                            resp.statusText='A pesquisa não retornou nemhum registro!!';
                            console.log(resp);
                            await conn.close();
                            console.log('server listening in port 3001');
                            res.end();
                        }
                        else{
                            resp.status=200;
                            resp.statusText='Succcess';
                            
                            let filiacao='';
                            let temp=[];
                            //console.log('data antes do erro-----');
                            //console.log(resp.data);
                            //console.log('data antes do erro-----');
                            resp.data.forEach(element => {
                                element.filiacao.forEach(element => {
                                    if(filiacao ===''){
                                        filiacao = element.nome + '('+ element.tipo.toLowerCase()+')';
                                    }else{
                                        filiacao = filiacao + ', ' + element.nome +'(' + element.tipo.toLowerCase()+')';
                                    }
                                });
                                element.filiacao=[];
                                element.filiacao[0]=filiacao;
                                temp.push(element);
                                filiacao='';
                            });
                            resp.data=temp;
                            temp=[];
                            //console.log('Brasil........');
                            // daqui     
/*                             let rgs=resp.data.map(item=>{
                                return item;
                            });
                            let i=0;let stmts=[];
const sql = `insert into TEMP${req.body.idUsuario}(rg,sequencialrg,digitorg,ufrg,nome,sexo,nascimento,filiacao,nomesocial,cpf,uf,
                       naturalidade,ibge,pais,codnacionalidade,cadastrobiometrico)  VALUES (
                        :rg,:sequencialrg,:digitorg,:ufrg,:nome,:sexo,:nascimento,:filiacao,:nomesocial,formatacpf(:cpf),:uf,:naturalidade,
                        to_char(:ibge),:pais,:codnacionalidade,:cadastrobiometrico)`;
              //console.log(sql);
                            const options = {
                                autoCommit: true,
                                bindDefs:{
                                rg: { type: OracleDB.STRING, maxSize:15 },
                                sequencialrg: { type: OracleDB.NUMBER },
                                digitorg: { type: OracleDB.STRING,maxSize:3 },
                                ufrg: { type: OracleDB.STRING, maxSize:2 },
                                nome: { type: OracleDB.STRING, maxSize:100 },
                                sexo: { type: OracleDB.STRING, maxSize:1 },
                                nascimento: { type: OracleDB.STRING, maxSize:10 },
                                filiacao: { type: OracleDB.STRING, maxSize:200 },
                                nomesocial: { type: OracleDB.STRING, maxSize:100 },
                                cpf:{ type: OracleDB.NUMBER },
                                uf: { type: OracleDB.STRING, maxSize:2 },
                                naturalidade: { type: OracleDB.STRING, maxSize:100 },
                                ibge: { type: OracleDB.NUMBER },
                                pais: { type: OracleDB.STRING, maxSize:50 },
                                codnacionalidade: { type: OracleDB.NUMBER},
                                cadastrobiometrico: { type: OracleDB.STRING, maxSize:5 }
                                }
                            };
                            while(i < rgs.length) {
                                try { 
                                    binds = [{
                                        rg: rgs[i].numRG,
                                        sequencialrg:  rgs[i].sequencialRG,
                                        digitorg: rgs[i].digitoRG,
                                        ufrg: rgs[i].rgUF,    
                                        nome: rgs[i].nomeRegistroCivil,
                                        sexo: rgs[i].sexo,
                                        nascimento: rgs[i].dataNascimento,
                                        filiacao: rgs[i].filiacao[0],
                                        nomesocial: rgs[i].nomeSocial,
                                        cpf: rgs[i].cpf,
                                        uf: rgs[i].ufNaturalidade||null,
                                        naturalidade: rgs[i].descrNaturalidade,
                                        ibge: rgs[i].codNaturalidadeIBGE||null,
                                        pais: rgs[i].pais,
                                        codnacionalidade: rgs[i].codNacionalidade,
                                        cadastrobiometrico: rgs[i].cadastroBiometrico?'TRUE':'FALSE'
                                    }];
                                
                                    result = await conn.executeMany(sql,binds,options); 
                                } 
                                catch(error){
                                    console.log(`error ${i}:`,error);
                                    console.log('error 147',error);
                                    let resp = {};mensagem=[]; 
                                    resp.status = 500;
                                    resp.statusText = 'Falha no Servidor..';
                                    mensagem[0] = error.message; 
                                    resp.dados=mensagem[0]; 
                                    console.log(resp);
                                    //res.render('envio/index', resp);
                                    console.log('server listening in port 3001');
                                    res.end();
                                }
                                i++;
                            }
                            await conn.close();
 */                            //até aqui
                            //resp={}; mensagem=[];
                            res.status=200;
                            res.statusText='Success';
                            mensagem[0] = `Success`;
                            //res.dados=mensagem[0];
                            //res.render('envio/index', resp);
                            //console.log(resp);
                            console.log('server listening in port 5000');
                            res.send(await resp.data).end();
                            
/*                             if((req.body.idUsuario=="MSB")||(req.body.idUsuario=="msb")){
                                console.log('saindo por aqui 222',resp.data);
                                res.send(await resp.data).end();
                            }else{
                                console.log('saindo por aqui xxx');
                                res.end();
                            }
 */                        }
                    }        
                    
                })
                .catch(async (error)=>{
                console.log('error::::::56:::',error);
                let resp = {}; 
                resp.status = 500;
                resp.statusText = await error; 
                resp.data = []; 
                //res.render('consulta/index', resp);
                //await conn.close();
                console.log(resp);
                res.send(`${error.response.status} - ${error.response.data.message}`);
                res.end('server listening in port 5000');
                });
            }
            else{
                //await conn.close();
                console.log('server listening in port 5000');
                res.json({ status:401, statusText:'401 05 Usuario nao autorizado.'}).end();
            }    
        }
        else{
            //await conn.close();
            console.log('server listening in port 5000');
            res.status(400).json({ status:400, statusText:'badRequest',data:msg }).end();
        }
    //}          
}
module.exports = { nivel1 };
