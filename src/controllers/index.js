//import { STRING } from 'oracledb';
import OracleDB from 'oracledb';
import { getConnection } from '../conexao.js';
import { getResultset } from '../resultset.js';
//import { gravaImagem } from '../gravaImagem';
import requestIp from 'request-ip';
import http from 'http';
import fileSystem from 'fs';
import path from 'path';
import fsReadDirRecGen from 'fs-readdir-rec-gen';
import { AsyncLocalStorage } from 'async_hooks';
import { NOTFOUND } from 'dns';


var rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem;


var mensagem=[];
var bufferfoto=null;
var buffercertidao=null;
var base64foto=null;
var base64certidao=null;
function filtrarPorExtensao(fileName) {
    return fileName.endsWith('.html');
  }


async function base64_encode_certidao(certidao){
    console.log('entrada na certidao',certidao);
    console.log('entrada na certidao',certidao);
    console.log('entrada na certidao',certidao);
    console.log('entrada na certidao',certidao);
    // caminho do arquivo no ambiente de desenvolvimento: c:/servidor/200325_003.jpg 
    //  caminho do arquivo no ambiente de producao:       /politec/sicp/061138_004.jpg
    //let filepath = path.join(__dirname,`../../temp/cert/${certidao}`);
    let caminhocertidao;
    if(certidao!==null) {
        caminhocertidao = `/politec/sicp/${certidao}`;
        
        
        //============================================================
        const Jimp = require("jimp");
        Jimp.read(caminhocertidao)
        .then((image) =>  {
            image.getBase64Async(Jimp.AUTO)
            .then((base64) => {
                base64certidao = base64; 
            })
            .catch((err)=>{
                console.log('erro_certidao', err);
                base64certidao =  null;
            });     
        })               
        .catch((err)=>{
            console.log('erro:certidao', err);
            base64certidao = null;
        });     
        //================================================================      
        /** 
        try{
            const fs = require('fs');
            base64certidao = fs.readFileSync(caminhocertidao,"base64");
            buffercertidao = Buffer.from(base64certidao,"base64");
            
           // return new Promise((resolve, reject) => {
           //     gravaImagem(buffer,filepath)
           // })
           return buffercertidao;
        }
        catch(Exception){
            console.log('erro na certidao:',Exception);
            return null;
        }
        */
        console.log('.certidao..saida2');
        return base64certidao;
    }
    else{
        base64certidao=null;
        console.log(' sem certidao...saida1');
        return base64certidao;
    }  
}

async function base64_encode(foto){
    console.log('entrada na foto',foto);
    console.log('entrada na foto',foto);
    console.log('entrada na foto',foto);
    console.log('entrada na foto',foto);
    console.log('entrada na foto',foto);

    // caminho do arquivo no ambiente de desenvolvimento: c:/servidor/200325_003.jpg 
    //  caminho do arquivo no ambiente de producao:       /politec/sicp/061138_004.jpg
    //let filepath = path.join(__dirname,`../../temp/foto/${foto}`);
    let caminhofoto;
    if(foto!==null) {
        caminhofoto = `/politec/sicp/${foto}`;

        //============================================================
        const Jimp = require("jimp");
        Jimp.read(caminhofoto)
        .then((image) =>  {
            image.getBase64Async(Jimp.AUTO)
            .then((base64) => {
                base64foto = base64; 
            })
            .catch((err)=>{
                console.log('erro_foto', err);
                base64foto =  null;
            });     
        })               
        .catch((err)=>{
            console.log('erro:foto', err);
            base64foto = null;
        });     
    //================================================================      
        /** 
        try{
            const fs = require('fs');
            base64foto = fs.readFileSync(caminhofoto,"base64");
            bufferfoto = Buffer.from(base64foto,"base64");
            //return new Promise((resolve, reject) => {
            //    return gravaImagem(buffer,filepath)
            //})
            //.then(()=>(buffer))
            //.catch((err)=>{
            //    console.log(err);
            return bufferfoto; 
            //});
        }
        catch(Exception){
            console.log('erro na foto:',Exception);
            return null;
        }
        */
        console.log('.foto..saida2');
        return base64foto;
    }
    else{
        base64foto=null;
        console.log(' sem foto...saida1');
        return base64foto;
    }
}  

function iduf(){

    let buff = Buffer.from('390e982518a50e280d8e2b535462ec1f');
    const secret = buff.toString('base64');
    return secret;
}

function formataData(data){
    let formatada = data.substr(8,2)+'/'+data.substr(5,2)+'/'+data.substr(0,4);
    return formatada;
}


/**
function somenteTeste(data){
    var algo;
    var request = require('request').defaults({ encoding: null });
    request.get('http://tinypng.org/images/example-shrunk-8cadd4c7.png', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            console.log(data);
        }
   });
   return algo; 
}
*/
function base64ToPage(base64,str,filePath)
{
    let file = fileSystem.readFile(filePath, function(err, data){
        if(err)	{
			console.error(err);
		}
		else {
			let html = data.toString('utf8');
			
            if(str==='foto'){ html     = html.replace("{{foto}}", base64);}
            if(str==='certidao'){ html = html.replace("{{certidao}}", base64);}
            
            fileSystem.writeFile(filePath, html, function (err){
  				if (err){
					console.error(err);
				}
				else
				{
                    console.log('exibe ',str); 
				}
			});
		}
	});
}

function copyFile(source, target) {
    fileSystem.copyFile(source, target, (err) => {
        if (err) console.log(err);
        console.log(`${source} copiado!`);
      });
}

function exibeNaPagina(imgfoto,imgcertidao,filePath){

 /**   
	const Jimp = require("jimp");
    
    Jimp.read(`/politec/sicp/${imgcertidao}`)
    .then(imagec =>  {
            imagec.quality(50);
            imagec.getBase64Async(Jimp.AUTO)
			.then(base64c =>
			{
				base64ToPage(base64c,'certidao',filePath);
			})
			.catch(err =>
			{
				console.log('image certidao:',err);
			});
    })
    .catch(err => {
        console.log('Lendo a certidao:',err);
    });

	Jimp.read(`/politec/sicp/${imgfoto}`)
    .then(imagef => {
        imagef.quality(50);
        imagef.getBase64Async(Jimp.AUTO)
        .then(base64f =>
			{
				base64ToPage(base64f,'foto',filePath);
			})
			.catch(err =>
			{
				console.log('image foto:',err);
			});
    })
    .catch(err => {
        console.log('Lendo a foto:',err);
    });
*/
    /** copia o arquivo e Faz apenas um link */
   // let foto,certidao; 
   // {
   //     foto = `/politec/sicp/${imgfoto}`;
   //     certidao = `/politec/sicp/${imgcertidao}`;
   //     copyFile(certidao, path.join(__dirname, '../../temp/cert/certidao.jpg'));
   //     copyFile(foto, path.join(__dirname, '../../temp/foto/foto.jpg'));
   // }
    /**
    let file = fileSystem.readFile(filePath, function(err, data){
        if(err)	{console.error('Lendo a pagina:',err);}
        else {
            let html = data.toString('utf8');
            
            html = html.replace("{{foto}}", path.join(__dirname, '../../temp/foto/foto.jpg'));
            html = html.replace("{{certidao}}", path.join(__dirname, '../../temp/cert/certidao.jpg'));
            
            fileSystem.writeFile(filePath, html, function (err){
                if (err){ console.error(err);}
                else { 
                    console.log('exibe foto e certidao:::::',foto,certidao); 
                }
            });
        }
    });
    */
}
function converte(arquivo){
    if(arquivo!==null){
        try{
            let filepath = `/politec/sicp/${arquivo}`; 
            let buff = fileSystem.readFileSync(filepath);
            let base64data = buff.toString('base64');
            return base64data;
        }
        catch(err){
            console.log();
            return null;
        }
    }    
}

async function transformer(req,row){
    //foto = await row.NOMEFOTO;
    //certidao = await row.NOMECERTIDAO;
// os campos abaixo fora retirados após conferência
    //"documentoCertidao": await converte(row.NOMECERTIDAO),  
    //"Cpf": row.CPFTEXT, 
    //"foto": await converte(row.NOMEFOTO),
//  "digitoRG": row.DIGITORG,
//  "sequencialRG": row.VIAEMISSAO,
return {
        "idUF": '390e982518a50e280d8e2b535462ec1f',
        "numRG": row.NUMRG,
        "rgUF": row.RGUF,
        "nomeRegistroCivil": row.NOMEREGISTROCIVIL,
        "nomeSocial": row.NOMESOCIAL,
        "filiacao": [
            {
            "nome": row.PAI,
            "tipofiliacao": "PAI"
            },
            {
            "nome": row.MAE,
            "tipofiliacao": "MAE"
            }
        ],
        "dataNascimento": row.DATANASCIMENTO,
        "sexo": row.SEXO,
        "codNacionalidade": row.CODNACIONALIDADE,
        "codNaturalidadeIbge": row.CODNATURALIDADEIBGE,
        "descrNaturalidade": row.DESCRNATURALIDADE,
        "ufNaturalidade": row.UFNATURALIDADE,
        "pais": row.PAIS,
        "cpf": row.CPF, // numerico
        "cadastroBiometrico": row.CADASTROBIOMETRICO,
        "dadosCertidao": row.DADOSCERTIDAO,
        "tipoCertidao": row.TIPOCERTIDAO,
        "cnh": row.CNH,
        "cns": row.CNS,
        "TituloEleitor": row.TITULOELEITOR,
        "pispasep": row.PISPASEP,
        "certidaoMilitar": row.CERTIDAOMILITAR,
        "ctps": row.CTPS,
        "cip": row.CIP,
        "indSaudeFisica": row.INDSAUDEFISICA,
        "indSaudeIntelectual": row.INDSAUDEINTELECTUAL,
        "indSaudeVisual": row.INDSAUDEVISUAL,
        "indSaudeAuditiva": row.INDSAUDEAUDITIVA,
        "indSaudeAutismo": row.INDSAUDEAUTISMO,
        "indTipoSanguineo": row.INDTIPOSANGUINEO,
        "indSaudeObservacao": row.INDSAUDEOBSERVACAO,
        "dataEmissao": row.DATAEMISSAO,
        "cedulaEmissao": row.CEDULAS,
        "viaEmissao": row.VIAEMISSAO,
        //"todas": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?descricaoImagem=TODAS&numRG=${row.NUMRG}&token=${req.headers['x-access-token']}`,
        //"maoDireitaPolegar": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_DIREITA_POLEGAR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoDireitaIndicador": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_DIREITA_INDICADOR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoDireitaMedio": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_DIREITA_MEDIO&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoDireitaAnular": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_DIREITA_ANULAR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoDireitaMinimo": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_DIREITA_MININO&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoEsquerdaPolegar": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_ESQUERDA_POLEGAR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoEsquerdaIndicador": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_ESQUERDA_INDICADOR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoEsquerdaMedio": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_ESQUERDA_MEDIO&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoEsquerdaAnular": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_ESQUERDA_ANULAR&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"maoEsquerdaMinimo": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=MAO_ESQUERDA_MININO&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`,
        //"rosto": `https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/imagem?cpfUsuario=${cpfUsuario}&descricaoImagem=ROSTO&nomeUsuario=${nomeUsuario}&numRG=${row.NUMRG}&rgUF=${row.RGUF}&sistemaOrigem=${sistemaOrigem}`
    };
}

async function consiste (cpfUsuario, nomeUsuario, numRG, rgUF, sistemaOrigem) {
    let i = 0; mensagem=[];
    
    /** 
    if ((cpfUsuario===null) || (cpfUsuario===undefined) || (cpfUsuario==='')) {
        mensagem[i]='o CPF do usuário é obrigatório.';
        i++;
    } 
    */
    if ((numRG===null) || (numRG===undefined) || (numRG==='')) {
        mensagem[i]='o Número do RG é obrigatório.';
        i++;
    } 
    /** 
    if ((rgUF===null) || (rgUF===undefined) || (rgUF==='')) {
        mensagem[i]='a UF do RG é obrigatória.';
        i++;
    } 
    if ((sistemaOrigem===null) || (sistemaOrigem===undefined) || (sistemaOrigem==='')) {
        mensagem[i]='o Identificador do Sistema é obrigatório.';
        i++;
    } 
    if ((nomeUsuario===null) || (nomeUsuario===undefined) || (nomeUsuario==='')) {
        mensagem[i]='o Nome do usuário é obrigatório.';
        i++;
    } 
    */
    if(mensagem.length > 0) {

        return false;
    }
    else{
        
        return true;
    }
    
}


async function registra(conn, rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem, ip) {
    
        
    const sql = `insert into INRC_ORIGEM (ID ,USUARIOCPF, USUARIONOME, SISTEMA, IP, RGUF, NUMRG ) VALUES (
                  :id, :usuariocpf, :usuarionome, :sistema, :ip, :rguf, :numrg)`;
    const options = {
        autoCommit: true,
        bindDefs:{
            id: {type: OracleDB.NUMBER},
            usuariocpf: {type: OracleDB.STRING, maxSize:25 },
            usuarionome: {type: OracleDB.STRING, maxSize:100 },
            sistema: {type: OracleDB.STRING, maxSize:50 },
            ip: {type: OracleDB.STRING, maxSize:25 },
            rguf: {type: OracleDB.STRING, maxSize:32 },
            numrg: {type: OracleDB.NUMBER }
        }
    };
    try { 
       var binds = [{
        id:null, usuariocpf:cpfUsuario, usuarionome:nomeUsuario, sistema:sistemaOrigem, ip:ip, rguf:rgUF,     numrg:parseInt(numRG)
    }];
 
       var result = await conn.executeMany(sql,binds,options);
       mensagem=[];
       return true;
    } 
    catch(error){
                                        
        mensagem[0]=error.message;
        mensagem[1]='erro na função registra()';
        console.log('error 204',error);
        return false;
    }
}


async function index(req,res) {
    //console.log('99', req.method);
    //console.log('1', req.params);
    //console.log('2', req.query);   // via get
    //console.log('3 - Post', req.body);    // via post
    //var rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem;

    //const { rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem } = req.params;
    
    if(req.method==='GET'){
        rgUF = req.query.rgUF;
        numRG = req.query.numRG;
        cpfUsuario = req.query.cpfUsuario;
        nomeUsuario = req.query.nomeUsuario;
        sistemaOrigem = req.query.sistemaOrigem;
    }
    if(req.method==='POST'){
        rgUF = req.body.rgUF;
        numRG = req.body.numRG;
        cpfUsuario = req.body.cpfUsuario;
        nomeUsuario = req.body.nomeUsuario;
        sistemaOrigem = req.body.sistemaOrigem;
    }
    var testeconsiste = await consiste( cpfUsuario, nomeUsuario, numRG, rgUF, sistemaOrigem);
    if(testeconsiste === false ){
        console.log('testeconsiste resultou false');
        //let resp={};
        //resp.status=400;
        //resp.statusText='Bad Request';
        //resp.data=mensagem;
        //console.log(resp);
        //res.json(resp);
        //res.end();
        res.setHeader('Content-Type', 'application/json');
        //res.status(400).json({mensagem:mensagem}).end();
        res.status(400).end(`${JSON.stringify(Object.assign({}, mensagem))}`);
    }
    else{
        const conn = await getConnection();
        if(typeof(conn)==='string') {
            //console.log(conn);
            //let resp = {};
            //mensagem[0]='Sem conexão de banco de dados.';
            //resp.statusCode=400;
            //resp.statusText='Conexão com banco de dados falhou';
            //resp.data=mensagem;
            //res.json(resp);
            //res.end();
            res.setHeader('Content-Type', 'application/json');
            res.status(500).end(`{${JSON.stringify({'mensagem':'Conexão com banco de dados falhou'})}}`);
        } 
        else {   

            const rs = await getResultset(conn, numRG);
            const row = await rs.getRow();
            if(row===undefined){
                //mensagem[0]=`RG ${numRG} não encontrado`;
                //let resp={};
                //resp.status=404;
                //resp.statusText='Not found';
                //resp.data=mensagem;
                res.setHeader('Content-Type', 'application/json');
                //res.status(404).end("{}");
                res.status(404).end(`${JSON.stringify({})}`);
                //res.json(resp);
                //res.end();
            }


            else {              
                
                var clientIp = requestIp.getClientIp(req);
                //var testeregistra = await registra(conn, rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem, clientIp); 
                var testeregistra = true; // para não registrar parametros da consulta no banco 
                if (testeregistra === false) {
                    //let resp={};
                    //resp.status=500;
                    //resp.statusText=mensagem[0];
                    //resp.data=mensagem;
                    console.log('e r r o 500');
                    res.setHeader('Content-Type', 'application/json');
                    //res.json(resp);
                    //res.end();
                    res.status(500).end(`${JSON.stringify(Object.assign({}, mensagem))}`);
                }
                else{

                    let resp={};
                    console.log('row:::::row::',row);
                    let data=transformer(req,row)
                    .then((data)=>{

                            res.setHeader('Content-Type', 'application/json'); 
                            //res.status(200).end(`{"data":${JSON.stringify(data)}}`);
                            res.status(200).end(`${JSON.stringify(data)}`);

                    })
                    .catch((error)=>{
                        console.log(error);
                        res.status(500).end(`${JSON.stringify(error)}`);
                    });              

                }
            }

        }
    }
}
module.exports={ index };