"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _oracledb = require('oracledb'); var _oracledb2 = _interopRequireDefault(_oracledb);
//const oracledb = require('oracledb');

const getResultset = async (conn, rg ) => {
        let result = await conn.execute(
            `select
            'false' as cadastroBiometrico,
            CMILITAR as certidaoMilitar,
            TRIM(IDPROFSIGLA1||' '||IDPROF1||' '||IDPROFUF1||' '||IDPROFSIGLA2||' '||IDPROF2||' '||IDPROFUF2) as cip,
            cnh,
            cns,
            decode(migracao,null,1,0,1,1,2,2,3) as codNacionalidade, 
            m.codibge as codNaturalidadeIBGE,
            trunc(cpfcid) as cpf, 
            formatacpf(cpfcid) as CpfText, 
            TRIM(CTPS1||' '||CTPSSERIE1||' '||CTPSUF1||' '||CTPS2||' '||CTPSSERIE2||' '||CTPSUF2) as ctps,
            pegacertidao(rg) as dadosCertidao,
            pegacaminho(rg,0) as documentoCertidao,
            pegaimagem(rg,0) as nomeCertidao,
            pegacedulas(rg) as cedulas,
            to_char(qual_em,'yyyy-mm-dd') as dataEmissao,
            to_char(datnas,'yyyy-mm-dd') as dataNascimento,
            m.nome as descrNaturalidade,
            null as digitoRG,
            decode(paicid,null,'NâO INFORMADO',paicid) as pai,
            decode(maecid,NULL,'NâO INFORMADO',maecid) as mae,
            'constante' as idUF,
            PEGAINDICATIVOSAUDE(rg,41) as indSaudeVisual,
            PEGAINDICATIVOSAUDE(rg,42) as indSaudeAutismo, 
            PEGAINDICATIVOSAUDE(rg,43) as indSaudeFisica, 
            PEGAINDICATIVOSAUDE(rg,44) as indSaudeIntelectual, 
            PEGAINDICATIVOSAUDE(rg,45) as indSaudeAuditiva,
            decode(fatorrh,null,null,'A+',1,'B+',2,'AB+',3,'O+',4,'A-',5,'B-',6,'AB-',7,'O-',8) as indTipoSanguineo,
            null as indSaudeObservacao, 
            nomecid as nomeRegistroCivil, 
            nomesocial, 
            rg as numRG,
            nompais as pais, 
            numisocial as pispasep,
            'AP' as rgUF,
            null as sequencialRG,
            decode(sexobio,'MASCULINO','M','FEMININO','F') as sexo,
            decode (tipcert,'NASCIMENTO','1','CASAMENTO','2','NATURALIZAÇÃO','3','CASAMENTO/OBITO','4',
            'IGUALDADE','6','CASAMENTO/SEPARACAO','7','CAS/DIVORCIO','9')  as tipoCertidao,
            titulo as  tituloEleitor,
            c.uf as ufNaturalidade,
            decode(via,'1ª','1','2ª','2',null) as viaEmissao,
            pegacaminho(rg,0) as foto, 
            pegaimagem(rg,0) as nomeFoto, 
            null as maoDireitaPolegar,
            null as maoDireitaIndicador,
            null as maoDireitaMedio,
            null as maoDireitaAnular,
            null as maoDireitaMinimo,
            null as maoEsquerdaPolegar,
            null as maoEsquerdaIndicador,
            null as maoEsquerdaMedio,
            null as maoEsquerdaAnular,
            null as maoEsquerdaMinimo        


            from cadger c, sicmunicipio m  
             where rg = :rg
             and m.codmunicipio=c.codmunicipio and m.uf=c.uf 

             union select
            
             'false' as cadastroBiometrico,
             CMILITAR as certidaoMilitar,
             TRIM(IDPROFSIGLA1||' '||IDPROF1||' '||IDPROFUF1||' '||IDPROFSIGLA2||' '||IDPROF2||' '||IDPROFUF2) as cip,
             cnh,
             cns,
             decode(migracao,null,1,0,1,1,2,2,3) as codNacionalidade, 
             null as codNaturalidadeIBGE,
             trunc(cpfcid) as cpf, 
             formatacpf(cpfcid) as CpfText, 
             TRIM(CTPS1||' '||CTPSSERIE1||' '||CTPSUF1||' '||CTPS2||' '||CTPSSERIE2||' '||CTPSUF2) as ctps,
             pegacertidao(rg) as dadosCertidao,
             pegacaminho(rg,0) as documentoCertidao,
             pegaimagem(rg,0) as nomeCertidao,
             pegacedulas(rg) as cedulas,
             to_char(qual_em,'yyyy-mm-dd') as dataEmissao,
             to_char(datnas,'yyyy-mm-dd') as dataNascimento,
             cidnasc as descrNaturalidade,
             null as digitoRG,
             decode(paicid,null,'NâO INFORMADO',paicid) as pai,
             decode(maecid,NULL,'NâO INFORMADO',maecid) as mae,
             'constante' as idUF,
             'false' as indSaudeAuditiva,
             'false' as indSaudeAutismo, 
             'false' as indSaudeFisica, 
             'false' as indSaudeVisual,
             'false' as indSaudeIntelectual, 
             decode(fatorrh,null,null,'A+',1,'B+',2,'AB+',3,'O+',4,'A-',5,'B-',6,'AB-',7,'O-',8) as indTipoSanguineo,
             null as indSaudeObservacao, 
             nomecid as nomeRegistroCivil, 
             nomesocial, 
             rg as numRG,
             nompais as pais, 
             numisocial as pispasep,
             'AP' as rgUF,
             null as sequencialRG,
             decode(sexobio,'MASCULINO','M','FEMININO','F') as sexo,
             decode (tipcert,'NASCIMENTO','1','CASAMENTO','2','NATURALIZAÇÃO','3','CASAMENTO/OBITO','4',
             'IGUALDADE','6','CASAMENTO/SEPARACAO','7','CAS/DIVORCIO','9')  as tipoCertidao,
             titulo as  tituloEleitor,
             null as ufNaturalidade,
             decode(via,'1ª','1','2ª','2',null) as viaEmissao,
             pegacaminho(rg,0) as foto, 
             pegaimagem(rg,0) as nomeFoto, 
             null as maoDireitaPolegar,
             null as maoDireitaIndicador,
             null as maoDireitaMedio,
             null as maoDireitaAnular,
             null as maoDireitaMinimo,
             null as maoEsquerdaPolegar,
             null as maoEsquerdaIndicador,
             null as maoEsquerdaMedio,
             null as maoEsquerdaAnular,
             null as maoEsquerdaMinimo        
  
             from cadger where rg = :rg 
             and nompais<>'BRASIL'
             `, [rg],
            { resultSet: true, outFormat: _oracledb2.default.OUT_FORMAT_OBJECT  } 
        );
        return result.resultSet;  
};
module.exports = { getResultset };