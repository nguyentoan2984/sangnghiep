const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');


class crudDonvi {
    
    static async get_crudDonvi() {
        let database =databaseInfo
        let selectSql =
            `
            select * from  dbo.OFFICE
            `;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được danh sách các đơn vị ');
       return result.recordset;
    }

    
    static async add_crudService(InfoDonvi,) {
        let database =databaseInfo
        let obj={}
       
         let   selectSql =
           `
           SELECT COUNT(dbo.OFFICE.OFFICEID) AS check_id
           FROM   dbo.OFFICE
           WHERE  dbo.OFFICE.OFFICEID ='${InfoDonvi.OFFICEID}'
           `;
        let    result = await queryDb(selectSql,database);
       if (result.recordset[0].check_id>0) throw new Error('id đã tốn tại ');
          selectSql =
       `
       INSERT INTO dbo.OFFICE
       (OFFICEID
       ,OFFICENAME
       ,ADDRESS
       ,PHONE
       ,FAX
       ,LOGO
       ,ORDERINDEX
       ,IPDATABASE
       ,DATABASENAME
       ,USERNAME
       ,PASSWORD
       ,RUNTIME
       ,ISACTIVE)
 VALUES
       ('${InfoDonvi.OFFICEID}'								
       ,'${InfoDonvi.OFFICENAME}'								
       ,'${InfoDonvi.ADDRESS}'							
       ,'${InfoDonvi.PHONE}'									
       ,'${InfoDonvi.FAX}'						
       ,NULL
       ,'${InfoDonvi.ORDERINDEX}'				
       ,'${InfoDonvi.IPDATABASE}'								
       ,'${InfoDonvi.DATABASENAME}'					
       ,'${InfoDonvi.USERNAME}'					
       ,'${InfoDonvi.PASSWORD}'						
       ,'${InfoDonvi.RUNTIME}'									
       ,'${InfoDonvi.ISACTIVE}'	
    	)	
      ` 
       result = await queryDb(selectSql,database);
       if (!result.rowsAffected[0]) throw new Error('không thêm được đơn vị mới ');
       selectSql =
       `
       select * from  dbo.OFFICE
       `;
       result = await queryDb(selectSql,database);
   if (!result.rowsAffected[0]) throw new Error('không load được danh sách các đơn vị ');
  
      
       return result.recordset;
    }

    

static async delete_crudDonvi(OFFICEID) {
        let database =databaseInfo
        let selectSql =
            `
            DELETE  FROM dbo.OFFICE
            WHERE    OFFICEID ='${OFFICEID}'
            `;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không xoá được đơn vị được chọn ');
         selectSql =
        `
        select * from  dbo.OFFICE
        `;
         result = await queryDb(selectSql,database);
       return result.recordset;
    }
    static async edit_crudDonvi(InfoDonvi) {
        let database =databaseInfo
       
        let    selectSql =
           `
           UPDATE dbo.OFFICE
           SET OFFICENAME = '${InfoDonvi.OFFICENAME}'
              ,ADDRESS = '${InfoDonvi.ADDRESS}'	
              ,PHONE ='${InfoDonvi.PHONE}'
              ,FAX = '${InfoDonvi.FAX}'
              ,LOGO= NULL
              ,ORDERINDEX ='${InfoDonvi.ORDERINDEX}'
              ,IPDATABASE = '${InfoDonvi.IPDATABASE}'
              ,DATABASENAME ='${InfoDonvi.DATABASENAME}'	
              ,USERNAME = '${InfoDonvi.USERNAME}'
              ,PASSWORD = '${InfoDonvi.PASSWORD}'
              ,RUNTIME = '${InfoDonvi.RUNTIME}'
              ,ISACTIVE = '${InfoDonvi.ISACTIVE}'
            WHERE OFFICEID='${InfoDonvi.OFFICEID}'
           `;
          let   result = await queryDb(selectSql,database);
       if (!result.rowsAffected[0]) throw new Error('không cập nhật được đơn vị được chọn ');
           
            selectSql =
            `
            select * from  dbo.OFFICE
            `;
             result = await queryDb(selectSql,database);
     
       return result.recordset;

    }


    
    
    

}
module.exports = crudDonvi;