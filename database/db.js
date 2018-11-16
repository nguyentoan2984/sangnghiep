
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
                sql.close();
                resolve(result);
    
               
            }).catch(err => {
                sql.close();
                reject(err)
               
            });
        });
    
    }

module.exports = queryDb;
