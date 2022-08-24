const dotenv = require('dotenv');
dotenv.config()


const MsSQL = require('@cubejs-backend/mssql-driver');
const Teradata = require('@cubejs-backend/teradata-jdbc-driver');
const { default: TeradataDriver } = Teradata

function mssql() {
    return new MsSQL({
        server: process.env.MSSQL_SERVER,
        database: process.env.MSSQL_DB_NAME,
        user: process.env.MSSQL_USER,
        password: process.env.MSSQL_PWD,
        port: 1433,
    })
}


function teradata() {
    return new TeradataDriver({
        url: process.env.TERADATA_URL,
        database: process.env.TERADATA_DB_NAME,
        readOnly: true,
    });
}


module.exports = {
    dbType: ({ dataSource }) => {
        switch(dataSource){
            case 'mssql': return 'mssql'
            case 'teradata': return 'teradata'
            default: return 'teradata'
        }
    },

    driverFactory: ({ dataSource } = {}) => {
        console.log('dataSource', dataSource);
        if (dataSource === 'teradata') {
            return teradata();
        }
        
        if(dataSource === 'mssql') {
            return mssql();
        }

        return teradata()
    },
};
