
async function queryDb(selectSql,database) {
    var sql = require("mssql")
    const config = {
       
         user: database.user,
         password: database.password,
         server: database.ip, 
         database: database.name
     };
        return new Promise((resolve, reject) => {
    
            new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request().query(selectSql)
            }).then(result => {
    
                resolve(result);
    
                sql.close();
            }).catch(err => {
    
                reject(err)
                sql.close();
            });
        });
    
    }

module.exports = queryDb;
