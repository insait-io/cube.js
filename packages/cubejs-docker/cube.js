const MsSQL = require('@cubejs-backend/mssql-driver');
const Teradata = require('@cubejs-backend/teradata-jdbc-driver');
const { TeradataDriver } = Teradata

function mssql() {
    return new MsSQL({
        server:"192.168.120.239",
        database: "insait-mssql",
        user: "david-insait",
        password: "abc123",
        port: 1433,
    })
}

function teradata() {
    return new TeradataDriver({
        url: "jdbc:teradata://192.168.120.234/USER=david,PASSWORD=abc123",
        database: "LEUMIMVP",
        readOnly: true,
    });
}


module.exports = {
    dbType: ({ dataSource }) => {
        switch(dataSource){
            case 'mssql': return 'mssql'
            case 'teradata': return 'teradata'
            default: return 'mssql'
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

        return mssql()
    },
};
