"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }//import { STRING } from 'oracledb';
var _oracledb = require('oracledb'); var _oracledb2 = _interopRequireDefault(_oracledb);
var _conexaojs = require('../conexao.js');
var _resultsetjs = require('../resultset.js');
//import { gravaImagem } from '../gravaImagem';
var _requestip = require('request-ip'); var _requestip2 = _interopRequireDefault(_requestip);
var _http = require('http'); var _http2 = _interopRequireDefault(_http);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fsreaddirrecgen = require('fs-readdir-rec-gen'); var _fsreaddirrecgen2 = _interopRequireDefault(_fsreaddirrecgen);
var _async_hooks = require('async_hooks');
var _dns = require('dns');

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
    let file = _fs2.default.readFile(filePath, function(err, data){
        if(err)	{
			console.error(err);
		}
		else {
			let html = data.toString('utf8');
			
            if(str==='foto'){ html     = html.replace("{{foto}}", base64);}
            if(str==='certidao'){ html = html.replace("{{certidao}}", base64);}
            
            _fs2.default.writeFile(filePath, html, function (err){
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
    _fs2.default.copyFile(source, target, (err) => {
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
            let buff = _fs2.default.readFileSync(filepath);
            let base64data = buff.toString('base64');
            return base64data;
        }
        catch(err){
            console.log();
            return null;
        }
    }    
}

async function transformer(row){
    //foto = await row.NOMEFOTO;
    //certidao = await row.NOMECERTIDAO;
    //"nomeSocial": row.NOMESOCIAL,
    //"cpf": row.CPF, // numerico
    //"documentoCertidao": await converte(row.NOMECERTIDAO),  
    //"Cpf": row.CPFTEXT, 
return {
        "idUF": '390e982518a50e280d8e2b535462ec1f',
        "numRG": row.NUMRG,
        "digitoRG": row.DIGITORG,
        "sequencialRG": row.SEQUENCIALRG,
        "rgUF": row.RGUF,
        "nomeRegistroCivil": row.NOMEREGISTROCIVIL,
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
        "foto": await converte(row.NOMEFOTO), 
        "maoDireitaPolegar": row.MAODIREITAPOLEGAR,
        "maoDireitaIndicador": row.MAODIREITAINDICADOR,
        "maoDireitaMedio": row.MAODIREITAMEDIO,
        "maoDireitaAnular": row.MAODIREITAANULAR,
        "maoDireitaMinimo": row.MAODIREITAMINIMO,
        "maoEsquerdaPolegar": row.MAOESQUERDAPOLEGAR,
        "maoEsquerdaIndicador": row.MAOESQUERDAINDICADOR,
        "maoEsquerdaMedio": row.MAOESQUERDAMEDIO,
        "maoEsquerdaAnular": row.MAOESQUERDAANULAR,
        "maoEsquerdaMinimo": row.MAOESQUERDAMINIMO

    };
}
async function consiste (cpfUsuario, nomeUsuario, numRG, rgUF, sistemaOrigem) {
    let i = 0; mensagem=[];
    if ((cpfUsuario===null) || (cpfUsuario===undefined) || (cpfUsuario==='')) {
        mensagem[i]='o CPF do usuário é obrigatório.';
        i++;
    } 
    if ((numRG===null) || (numRG===undefined) || (numRG==='')) {
        mensagem[i]='o Número do RG é obrigatório.';
        i++;
    } 
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
    if(mensagem.length > 0) {

        return false;
    }
    else{
        
        return true;
    }
    
    return true;
}


async function registra(conn, rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem, ip) {
    
        
    const sql = `insert into INRC_ORIGEM (ID ,USUARIOCPF, USUARIONOME, SISTEMA, IP, RGUF, NUMRG ) VALUES (
                  :id, :usuariocpf, :usuarionome, :sistema, :ip, :rguf, :numrg)`;
    const options = {
        autoCommit: true,
        bindDefs:{
            id: {type: _oracledb2.default.NUMBER},
            usuariocpf: {type: _oracledb2.default.STRING, maxSize:25 },
            usuarionome: {type: _oracledb2.default.STRING, maxSize:100 },
            sistema: {type: _oracledb2.default.STRING, maxSize:50 },
            ip: {type: _oracledb2.default.STRING, maxSize:25 },
            rguf: {type: _oracledb2.default.STRING, maxSize:32 },
            numrg: {type: _oracledb2.default.NUMBER }
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
    var rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem;

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
        const conn = await _conexaojs.getConnection.call(void 0, );
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

            const rs = await _resultsetjs.getResultset.call(void 0, conn, numRG);
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
                
                var clientIp = _requestip2.default.getClientIp(req);
                var testeregistra = await registra(conn, rgUF, numRG, cpfUsuario, nomeUsuario, sistemaOrigem, clientIp); 
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
                    let data=transformer(row)
                    .then((data)=>{

                        if((req.method==='GET')&&(sistemaOrigem.substr(0,2)!=='V.')){ //Todas UFs do país. exceto AP
                        //if(req.method==='GET'){ // Qualquer UF do país inclusive AP
                        
                            //resp.status=200;
                            //resp.statusText='Success';
                            //resp.data=data;
                            res.setHeader('Content-Type', 'application/json'); 
                            //res.status(200).end(`{"data":${JSON.stringify(data)}}`);
                            res.status(200).end(`${JSON.stringify(data)}`);
                        }
                        
                        if((req.method==='POST')||(sistemaOrigem.substr(0,2)==='V.')){ // somente UF = AP
                        //if(req.method==='POST'){ // UF = AP
                                        
                            setTimeout(()=>{

                                resp.status=200;
                                resp.statusText='Success';
                                resp.data=data;
                                var filePath = _path2.default.join(__dirname,'../../temp/');
                                for (let file of _fsreaddirrecgen2.default.call(void 0, filePath, filtrarPorExtensao)) {
                                    // apagar o arquivo html se houver na pasta temp
                                    _fs2.default.unlinkSync(file);
                                }          
                                
                                
                                filePath = _path2.default.join(__dirname, `../../temp/${numRG}.html`);
                                _fs2.default.writeFile(filePath, ` 
                                    <!DOCTYPE html>                 
                                    <html lang="pt-br">               
                                    <head>                            
                                    <meta charset="utf-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">     
                                    <title>SIC - INRC</title>
                                    <style>
                                        div.container {
                                            height: 100%;
                                            background: -webkit-linear-gradient(top, #088fad 20%, #00d5ff 100%);
                                        }
                                
                                        div.titulo {
                                            font-size: 2vw;
                                            background-color: green;
                                            text-align: center;
                                            padding: 1vw;
                                            position: relative;
                                        }
                                    
                                        div.op1 {
                                            width: 40%;
                                            display: inline-block;
                                            background-color: white;
                                            font-size: 3vw;
                                            text-align: center;
                                            padding: 5vw 0vw 5vw 0vw;
                                            min-width:40vw;
                                        }
                                    
                                        div.op2 {
                                            width: 40%;
                                            background-color: white;
                                            display: inline-block;
                                            margin-right: 0vw;
                                            font-size: 3vw;
                                            text-align: center;
                                            padding: 5vw 0vw 5vw 0vw;
                                            min-width:40vw;
                                            float:right;
                                            overflow-x: hidden;
                                            overflow-y: auto;
                                        }                              --!>
        
                                        div.scrool {
                                            width: 100%;
                                            background-color: white;
                                            display: inline-block;
                                            margin-right: 0vw;
                                            font-size: 3vw;
                                            text-align: center;
                                            padding: 0vw 0vw 5vw 0vw;
                                            min-width:40vw;
                                        }                              --!>
                                        tr:nth-child(even) {
                                            background-color: #D6EEEE;
                                        } 
                                    </style>                                                  
                                    </head>                                                              
                                    <body>  
                                    <div class="container">
                                        <div class="col-md-12"></div>
                                        <div class="titulo">POLITEC - SIC - INRC</div>
                                        <div class="col-md-12"> 
                                            <h4 align=center>RG:${numRG} - Detalhes</h4>
                                        </div>
                                        <div class="col-md-12" align=center>
                                            <div class="op1">
                                                <img alt="foto" src="https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/foto?foto=${row.NOMEFOTO}" height="400" width="300"  />
                                            </div>
                                            <div class="op2">
                                                <div class="scrool">
                                                    <img alt="certidao" src="https://sic-inrc.portal.ap.gov.br:5000/sic/api/v1/cert?certidao=${row.NOMECERTIDAO}" height="800" width="600"  />
                                                </div>
                                            </div> 
                                        </div>
                                        <hr>
                                        <div class="col-md-12"> 
                                            <table>   
                                                <th>Nome</th><th>RG</th><th>CPF</th><th>Data Nascimento</th>
                                                <tr><td width=25% align=center>${resp.data.nomeRegistroCivil}</td>
                                                <td width=25% align=center>${resp.data.numrg} ${resp.data.via}ªVia</td>
                                                <td width=25% align=center>${resp.data.Cpf}</td>
                                                <td width=25% align=center>${formataData(resp.data.dataNascimento)}</td></tr>`, function (err){    
                                                if (err) throw err;
                                });
                                _fs2.default.appendFile(filePath, `   
                                    <th>Município Nascimento</th><th>UF Nascimento</th><th>Pai</th><th>Mãe</th> 
                                    <tr><td width=25% align=center>${resp.data.descrnaturalidade}</td>
                                    <td width=25% align=center>${resp.data.ufnaturalidade}</td>
                                    <td width=25% align=center>${resp.data.filiacao[0].nome}</td>
                                    <td width=25% align=center>${resp.data.filiacao[1].nome}</td></tr>
                                    <th>Nacionalidade</th><th>Sexo</th><th></th><th>Origem dos Dados</th>
                                    <tr><td width=25% align=center>${resp.data.pais}</td>
                                    <td width=25% align=center>${resp.data.sexo}</td>
                                    <td width=25% ></td>
                                    <td width=25% align=center>${resp.data.rgUF}</td>
                                    </tr></table></div></div>
                                    <footer>
                                    <h6 align=center><strong>Copyright © 2022 Prodap.</strong> Todos os direitos reservados. <strong>Versão</strong> ${sistemaOrigem}</h6>
                                    </footer>
                                    </body></html>
                                    `, function (err){    
                                        if (err) throw err;
                                });

                                //exibeNaPagina(`${row.NOMEFOTO}`,`${row.NOMECERTIDAO}`,filePath); 

                                /**   Saída                                                                 */
                                if(req.method==='POST'){  // somente UF = Amapá
                                    res.writeHead(200, {
                                        //"Content-Type": "text/html; charset=utf-8",
                                        "Content-Type": "application/octet-stream",
                                        "Content-Disposition": "attachment; filename=" + filePath  //inline 
                                    }); 
                                    setTimeout(()=>{
                                        _fs2.default.createReadStream(filePath).pipe(res);
                                    },5000); //10
 
                                }

                                if(req.method==='GET'){ // somente UF = Amapá
                                    res.writeHead(200, {
                                        "Content-Type": "text/html; charset=utf-8",
                                        "Content-Disposition": "inline; filename=" + filePath 
        
                                    });
                                    setTimeout(()=>{
                                        _fs2.default.createReadStream(filePath).pipe(res);
                                    },1000); //estava 5000
                                }
        
                            },5000); //1000 estava 1000
                        }

                    });              

                }
            }

        }
    }
}
module.exports={ index };