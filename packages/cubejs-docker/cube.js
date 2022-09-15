const dotenv = require('dotenv');
dotenv.config()


const MsSQL = require('@cubejs-backend/mssql-driver');
const Teradata = require('@cubejs-backend/teradata-jdbc-driver');
const POSTGRESQL = require('@cubejs-backend/postgres-driver');

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

function postgres() {
    return new POSTGRESQL({
        server:"localhost",
        database: "bank_local",
        user: "postgres",
        password: "mysecretpassword",
        port: 5432,
    })
}

module.exports = {
    dbType: ({ dataSource }) => {
        console.trace("Here I am!")
        switch(dataSource) {
            case 'postgres': return 'postgres'
            case 'mssql': return 'mssql'
            case 'teradata': return 'teradata'
            default:
                // console.error('invalid dbType: ', dbType)
                // return null
                return 'postgres'
        }
    },

    driverFactory: ({ dataSource } = {}) => {
        console.trace("Here I am2!")
        console.log('dataSource', dataSource);
        switch(dataSource) {
            case 'teradata': return teradata()
            case 'mssql': return mssql()
            case 'postgres': return postgres()
            default:
                //console.error('invalid data source: ', dataSource)
                //return null
                return postgres()
        }
    },
};
