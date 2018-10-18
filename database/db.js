
async function queryDb(selectSql,database) {
    var sql = require("mssql")
    const config = {
        // tổng chứa thong tin 2 db don vi
    
        //  user: 'bquser',
        //  password: 'bqpassword',
        //  server: '45.117.171.3', 
        //  database: 'BQDB' 
    
        //  user: 'bqueueuser',
        //  password: 'bqueuepassword',
        //  server: '45.117.171.3', 
        //  database: 'BQueueDB' 
    
         // user: 'bqueueuser2',
         // password: 'bqueue2password',
         // server: '45.117.171.3', 
         // database: 'BQueueDB2' 
       
       
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

 
 
 
//  function  queryDb(selectSql,database) {
//     var sql = require("mssql")
//     const config = {
//         // tổng chứa thong tin 2 db don vi
    
//         //  user: 'bquser',
//         //  password: 'bqpassword',
//         //  server: '45.117.171.3', 
//         //  database: 'BQDB' 
    
//         //  user: 'bqueueuser',
//         //  password: 'bqueuepassword',
//         //  server: '45.117.171.3', 
//         //  database: 'BQueueDB' 
    
//          // user: 'bqueueuser2',
//          // password: 'bqueue2password',
//          // server: '45.117.171.3', 
//          // database: 'BQueueDB2' 
       
       
//          user: database.user,
//          password: database.password,
//          server: database.ip, 
//          database: database.name
//      };


//        return new Promise((resolve, reject) => {

//         sql.connect(config, function (err) {
            
//             if (err) return reject(err);
        
//                 // create Request object
//                 let request = new sql.Request();
              
//                 // query to the database and get the records
//                 request.query(selectSql, function (err, recordset) {
//                     if (err) {      reject(err)
//                                     sql.close()
//                                     }
//                     resolve(recordset)
                  
//                     sql.close()
//                 });
//             });
//        });
//    }


module.exports = queryDb;
