"use strict";//oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_12_14'});
const oracledb = require('oracledb');
if (process.platform === 'win32') {
        try {
          oracledb.initOracleClient({libDir: '/opt/oracle/instantclient_21_6/'});   // /opt/oracle/instantclient_19_15 ou _21_6  C:\\instantclient_19_14
          //oracledb.initOracleClient({libDir: 'C:\\instantclient_19_14'});   // /opt/oracle/instantclient_19_15 ou _21_6  C:\\instantclient_19_14
        } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }
}


async function getConnection(){

    var connection=null;
    try {
        connection = await oracledb.getConnection({ user: "sicp", password: "prod", connectionString: "192.168.251.2/prod" });
        return connection;
    }
    catch (err) {
        return err.message;
    }
}
module.exports = { getConnection };


