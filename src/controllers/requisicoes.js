process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import {axios} from 'axios';
//const {axios} = require('axios');


async function retornaToken (data) {
  console.log('novo token novo tokennovo tokennovo tokennovo tokennovo tokennovo token');
  console.log('novo token novo tokennovo tokennovo tokennovo tokennovo tokennovo token');
  return data.access_token;
}

/** comentado pra teste
async function tudobem(response) {
  let resp = await {'status':response.status,'message':response.statusText,'data':response.data}; 
  console.log('aqui..linha 12  da requisica.:',resp);
  return resp;
}
*/

async function opps(error) {
    console.log('teria q passar aqui..opps 17.requisica..');
        if((error.response.status>=400) && (error.response.status<500)){
            //console.log('Status:', error.response.status,error.response.data);
          //console.log('Headers:',error.response.headers);
          let resp =  await {'status':error.response.status, 'message':error.response.statusText,'data':error.response.data};
          return resp; 
        }
        else {
          // Something happened in setting up the request that triggered an Error
           console.log('Erro:', error.config);
           let resp =  {'status':'erro', mensagen:'Erro de configuração'}; 
           return resp; 
        } 
}

/**                                    pega token                                                                  */
/**                                    pega token                                                                  */
/**                                    pega token                                                                  */


const pegaToken = async () => {
  let buff = Buffer.from('390e982518a50e280d8e2b535462ec1f'+':'+'dh3han3nl2dds');
  const secret = buff.toString('base64');
  const url  = 'https://auth-cs-hml.identidadedigital.pr.gov.br/centralautenticacao/api/v1/token/jwt';
  const data = { client_id: '390e982518a50e280d8e2b535462ec1f', client_secret: 'dh3han3nl2dds' };
  const config = { 
      params: {grant_type: 'client_credentials', scope: 'inrc.api.rg.updater'},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':`Basic ${secret}`, },
  };
  const axios = require("axios").default;
  const qs = require('qs');
  
  return new Promise((retornaToken, opps) => { 
    axios.post(url, qs.stringify(data), config)
    .then(async (data) => {
      
      return await retornaToken(data);
    })
    .catch( async (error) => {
      return await opps(error);
    });
  });
};

/** Pega token para consulta  */
const pegaAuth = async () => {
  let buff = Buffer.from('390e982518a50e280d8e2b535462ec1f'+':'+'dh3han3nl2dds');
  const secret = buff.toString('base64');
  const url  = 'https://auth-cs-hml.identidadedigital.pr.gov.br/centralautenticacao/api/v1/token/jwt';
  const data = { client_id: '390e982518a50e280d8e2b535462ec1f', client_secret: 'dh3han3nl2dds' };
  const config = { 
      params: {grant_type: 'client_credentials', scope: 'inrc.api.rest'},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':`Basic ${secret}`, },
  };
  const axios = require("axios").default;
  const qs = require('qs');
  
  return new Promise((retornaToken, opps) => { 
    axios.post(url, qs.stringify(data), config)
    .then(async (data) => {
      
      return await retornaToken(data);
    })
    .catch( async (error) => {
      return await opps(error);
    });
  });
};


/** Pega token local para consulta detalhada e imagens  */

const pegaAuthLocal = async (client_id,client_secret) => {
  const url  = 'https://sic-inrc.portal.ap.gov.br/sic/api/v1/detalhada';
  const data = { client_id: client_id, client_secret:client_secret };
  const config = { };
  const axios = require("axios").default;
  const qs = require('qs');
  return new Promise((retornaToken, opps) => { 
    axios.post(url, qs.stringify(data), config)
    .then(async (response) => {
      return  retornaToken(response.data.access_token);
    })
    .catch( async (error) => {
      console.log(error);
      return null;
    });
  });
};



/**                                    funções exportadas                                                                  */
/**                                    funções exportadas                                                                  */
/**                                    funções exportadas                                                                  */
/**                                    funções exportadas                                                                  */
/**                                    funções exportadas                                                                  */


/** 
const postlote = async (lote) => {
       
      let pgtoken = await pegaToken();
      const https = require('https');
      const agent = new https.Agent({
          rejectUnauthorized:false
      });
      
      let url,data;
      url=(lote.length===1)?'https://homologacao.apigateway.pr.gov.br/celepar/inrcrgupdaterlab/api/v1/cidadao'
      :'https://homologacao.apigateway.pr.gov.br/celepar/inrcrgupdaterlab/api/v1/cidadaos';
      
      data =lote;
      //data = (lote.length===1)?lote[0]:lote;
     
      const config = {
          headers:{'consumerId':'INRC-AP', 'Content-Type':'application/json', 'Authorization': `Bearer ${pgtoken.data.access_token}`, },
          json: 'true',
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
      };
    

        
      const axios = require("axios").default;
      const qs = require('qs');
      
      console.log('está no postlog.....133 lote tamanho:',lote.length);

      const postando = new Promise(( tudobem, opps ) => { 

          axios.post(url, (data), config)
             .then((data)=>{
                  console.log('data ok');
                  tudobem(data);
              })
             .catch((error)=>{

                console.log('Error 4:',error.response.data);
                //opps(error.reponse);
              });

      })
      .then(async(data)=>{
          //console.log('data 126',data);
          let resp = await {'status':data.status,'message':data.statusText,'data':data.data}; 
          console.log('resolvido 128',resp);
          return resp;
      })
      .catch(async (resp)=>{
        console.log('rejeitado::::::::::::120:::',resp);
        ///resp = await opps(error);
        return resp;
      });

          
};
*/
module.exports = { pegaToken, pegaAuth, pegaAuthLocal };

