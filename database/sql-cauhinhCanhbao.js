const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');


class canhbao {
    static async get_serviceWarning(OFFICEID,SERVICEID) {
        let obj={}
        let arrayReturn=[]
        let database =databaseInfo
           let selectSql =
           `      SELECT  
           WAITTIMEMAX ,      
           SERVICETIMEMAX,   
           DISCOUNTITIMEMAX
           FROM 	dbo.SYSTEMCONFIGSERVICEINFO
           WHERE   SERVICEID='${SERVICEID}' 
                   AND OFFICEID='${OFFICEID}'`
           ;
       let result = await queryDb(selectSql,database);
    //    if (!result.rowsAffected[0]) throw new Error('không load được các thông số cảnh báo dịch vụ của đơn vị được chọn ');
    obj.WAITTIMEMAX = ( result.recordset[0]== undefined || result.recordset[0]== null ) ? 0 : result.recordset[0].WAITTIMEMAX 
    obj.SERVICETIMEMAX = ( result.recordset[0]== undefined || result.recordset[0]== null ) ? 0 : result.recordset[0].SERVICETIMEMAX 
    obj.DISCOUNTITIMEMAX = ( result.recordset[0]== undefined || result.recordset[0]== null ) ? 0 : result.recordset[0].DISCOUNTITIMEMAX 
         arrayReturn.push(obj)
         return arrayReturn;
       }
       static async update_serviceWarning(OFFICEID,SERVICEID,selectedOption,index) {
        let database =databaseInfo
        if ( index ==0)
        {
                  let    selectSql =
                    `  UPDATE dbo.SYSTEMCONFIGSERVICEINFO 
                    SET WAITTIMEMAX='${selectedOption.timeWait_max}',
                    SERVICETIMEMAX='${selectedOption.timeService_max}',
                    DISCOUNTITIMEMAX='${selectedOption.time_2so}'
                    WHERE  OFFICEID='${OFFICEID}' AND 	SERVICEID='${SERVICEID}'`
                    ;
                  let   result = await queryDb(selectSql,database);
            if (result.rowsAffected[0]) return
                        selectSql =
                    `  BEGIN
                    DECLARE @ID uniqueidentifier
                    SET @ID = NEWID()
                    
                    INSERT INTO dbo.SYSTEMCONFIGSERVICEINFO(ID,OFFICEID,SERVICEID,WAITTIMEMAX,SERVICETIMEMAX,DISCOUNTITIMEMAX,UNITTIME)
                        VALUES  (NEWID(),'${OFFICEID}','${SERVICEID}','${selectedOption.timeWait_max}',
                        '${selectedOption.timeService_max}','${selectedOption.time_2so}','1')  
                        END`
                        result = await queryDb(selectSql,database);
                    if (!result.rowsAffected[0]) throw new Error('cập nhật warning cho dịch vu không thành công ');
            }
        else{
                 let selectSql =
                 `DELETE  dbo.SYSTEMCONFIGSERVICEINFO 
                 WHERE  OFFICEID='${OFFICEID}'
                 `
                  let result = await queryDb(selectSql,database);
            // if (!result.rowsAffected[0]) throw new Error('cập nhật warning cho dịch vu không thành công ');

                selectSql =
                `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
                WHERE  OFFICEID='${OFFICEID}'`;
            result = await queryDb(selectSql,database);
            if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
            let database1 ={
                user: result.recordset[0].USERNAME,
                password: result.recordset[0].PASSWORD,
                ip: result.recordset[0].IPDATABASE,
                name: result.recordset[0].DATABASENAME 
            }
            selectSql =
           `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
           ORDER BY STARTNO`;
        result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không load thiết lập được mức cảnh báo cho các dịch vụ ');
           

            for ( let num of result.recordset ){
       selectSql =
       ` 
       BEGIN
       DECLARE @ID uniqueidentifier
       SET @ID = NEWID()
       INSERT INTO dbo.SYSTEMCONFIGSERVICEINFO(ID,OFFICEID,SERVICEID,WAITTIMEMAX,SERVICETIMEMAX,DISCOUNTITIMEMAX,UNITTIME)
           VALUES  ( NEWID(),'${OFFICEID}','${num.SERVICEID}','${selectedOption.timeWait_max}',
           '${selectedOption.timeService_max}','${selectedOption.time_2so}','1') 
           END `
           result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load thiết lập được mức cảnh báo cho các dịch vụ ');
            }
    }
         return ;
       }
       
 static async get_checkboxWarning(OFFICEID) {
     let obj={}
     let arrayReturn=[]
        let database =databaseInfo
           let selectSql =
           `   SELECT 	OFFICEID,
                BYSOUND,			
                BYIMG,			
                IMGNAME				
            FROM   dbo.SYSTEMCONFIGWARNING
            WHERE   OFFICEID='${OFFICEID}'       `
           ;
       let result = await queryDb(selectSql,database);
       if (result.rowsAffected[0]) return result.recordset
             selectSql =
            `  BEGIN
            DECLARE @ID uniqueidentifier
            SET @ID = NEWID()
            INSERT INTO dbo.SYSTEMCONFIGWARNING(ID,OFFICEID,BYSOUND,BYIMG,IMGNAME,IMGEXTENSION,IMGSIZE,IMGFOLDER)
            VALUES(NEWID(),'${OFFICEID}','1','1','canhbao','jpg','30','.../IMG/IMGWARNIGING')
            END`
            ;
           result = await queryDb(selectSql,database);
          if (!result.rowsAffected[0]) throw new Error('không load được checkbox canh báo ');
            obj.BYSOUND=true
            obj.BYIMG=true
            arrayReturn.push(obj)
            return arrayReturn;
       }
       static async update_checkboxWarning(OFFICEID,selectedOption) {
           let database =databaseInfo
              let selectSql =
              `   UPDATE dbo.SYSTEMCONFIGWARNING 
              SET BYSOUND ='${selectedOption.sound}',
              BYIMG='${selectedOption.picture}'
              WHERE  OFFICEID='${OFFICEID}'        `
              ;
          let result = await queryDb(selectSql,database);
             if (!result.rowsAffected[0]) throw new Error('không update được checkbox canh báo ');
               return ;
          }

}
module.exports = canhbao;