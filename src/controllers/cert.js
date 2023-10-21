import path from 'path';
import fs from 'fs';

async function cert(req,res) {
    let arquivo = await req.query.certidao;
    let cert = arquivo +'_001'+ '.jpg'; 
    let filepath = `/politec/sicp/${cert}`;
    let buff = null;
    let base64data = null;
    if(arquivo!==null){
    
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        try {

            buff = fs.readFileSync(filepath);
            base64data = buff.toString('base64');
            res.write(base64data, "base64");
        }
        catch(err){
            res.write("", "base64");
        }
    
    }
    res.end();
}
module.exports = {cert};