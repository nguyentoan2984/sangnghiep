const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');


class crudDichvu {
    
    static async get_crudService(OFFICEID) {
        let database =databaseInfo
        let selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
            selectSql =
           `SELECT * FROM dbo.SERVICEINFO
           ORDER BY SERVICEID`;
             result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
      
       for (let num of  result.recordset ){
            num.STARTTIME= moment(num.STARTTIME).utc().format('HH:mm:ss')
            num.ENDTIME= moment(num.ENDTIME).utc().format('HH:mm:ss')
            num.STARTTIME2= moment(num.STARTTIME2).utc().format('HH:mm:ss')
            num.ENDTIME2= moment(num.ENDTIME2).utc().format('HH:mm:ss')
       }
    
     
       return result.recordset;
    }

    
    static async add_crudService(Infoservice,OFFICEID) {
        let database =databaseInfo
        let obj={}
        let selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
            selectSql =
           `
           BEGIN
           DECLARE @ID tinyint
           IF (SELECT COUNT(SERVICEID) FROM dbo.SERVICEINFO) = 0
               SET @ID = '0'
           ELSE
               SELECT @ID = MAX(SERVICEID) FROM dbo.SERVICEINFO
               SELECT @ID = @ID+1
       
           SELECT @ID AS serviceid
       END
           `;
             result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không tạo được id cho dịch vụ được thêm mới ');
      obj.serviceid=result.recordset[0].serviceid
      let svcode=OFFICEID+obj.serviceid
      
     console.log(obj,svcode)
      //    for (let num of  result.recordset ){
    //         num.STARTTIME= moment(num.STARTTIME).utc().format('HH:mm:ss')
    //         num.ENDTIME= moment(num.ENDTIME).utc().format('HH:mm:ss')
    //         num.STARTTIME2= moment(num.STARTTIME2).utc().format('HH:mm:ss')
    //         num.ENDTIME2= moment(num.ENDTIME2).utc().format('HH:mm:ss')
    //    }
    selectSql =
    `
    INSERT INTO dbo.SERVICEINFO
    (SERVICEID
    ,SVcode
    ,SERVICENAME
    ,STARTNO
    ,ENDNO
    ,STARTTIME
    ,ENDTIME
    ,STARTTIME2
    ,ENDTIME2
    ,CURRENTNO
    ,ISSUEDNO
    ,COPIES
    ,MAXTIME
    ,RESET
    ,CONTI
    )
VALUES
    ('${obj.serviceid}'				
    ,'${svcode}'			
    ,N'${Infoservice.SERVICENAME}'			
    ,'${Infoservice.STARTNO}'				
    ,'${Infoservice.ENDNO}'	
    ,'${Infoservice.STARTTIME}'			
    ,'${Infoservice.ENDTIME}'				
    ,'${Infoservice.STARTTIME2}'				
    ,'${Infoservice.ENDTIME2}'				
    ,NULL			
    ,NULL					
    ,'${Infoservice.COPIES}'				
    ,'${Infoservice.MAXTIME}'				
    ,'${Infoservice.RESET}'			
    ,'${Infoservice.CONTI}'				
    )

    `;
      result = await queryDb(selectSql,database1);
if (!result.rowsAffected[0]) throw new Error('không tạo được id cho dịch vụ được thêm mới ');
        selectSql =
        `SELECT * FROM dbo.SERVICEINFO
        ORDER BY SERVICEID`;
        result = await queryDb(selectSql,database1);
        for (let num of  result.recordset ){
            num.STARTTIME= moment(num.STARTTIME).utc().format('HH:mm:ss')
            num.ENDTIME= moment(num.ENDTIME).utc().format('HH:mm:ss')
            num.STARTTIME2= moment(num.STARTTIME2).utc().format('HH:mm:ss')
            num.ENDTIME2= moment(num.ENDTIME2).utc().format('HH:mm:ss')
       }
       return result.recordset;
    }
static async delete_crudService(serviceidDelete,OFFICEID) {
        let database =databaseInfo
        let selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
            selectSql =
           `
           DELETE  FROM dbo.SERVICEINFO
           WHERE    SERVICEID ='${serviceidDelete}'
           `;
             result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không xoá được dịch vu của đơn vị được chọn ');
            selectSql =
            `SELECT * FROM dbo.SERVICEINFO
            ORDER BY SERVICEID`;
            result = await queryDb(selectSql,database1);
           
            for (let num of  result.recordset ){
                num.STARTTIME= moment(num.STARTTIME).utc().format('HH:mm:ss')
                num.ENDTIME= moment(num.ENDTIME).utc().format('HH:mm:ss')
                num.STARTTIME2= moment(num.STARTTIME2).utc().format('HH:mm:ss')
                num.ENDTIME2= moment(num.ENDTIME2).utc().format('HH:mm:ss')
           }
     
       return result.recordset;
    }
    static async edit_crudService(Infoservice,OFFICEID) {
        let database =databaseInfo
        let selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        let result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
            selectSql =
           `
           UPDATE dbo.SERVICEINFO
           SET SERVICENAME=N'${Infoservice.SERVICENAME}' 			
              ,STARTNO='${Infoservice.STARTNO}' 			
              ,ENDNO='${Infoservice.ENDNO}' 					
              ,STARTTIME='${Infoservice.STARTTIME}' 			
              ,ENDTIME='${Infoservice.ENDTIME}' 				
              ,STARTTIME2='${Infoservice.STARTTIME2}' 			
              ,ENDTIME2='${Infoservice.ENDTIME2}' 				
              ,CURRENTNO=NULL					
              ,ISSUEDNO=NULL					
              ,COPIES='${Infoservice.COPIES}' 				
              ,MAXTIME='${Infoservice.MAXTIME}' 					
              ,RESET='${Infoservice.RESET}' 						
              ,CONTI='${Infoservice.CONTI}' 							
         WHERE SERVICEID='${Infoservice.SERVICEID}' 
           `;
             result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không cập nhật được dịch vu của đơn vị được chọn ');
            selectSql =
            `SELECT * FROM dbo.SERVICEINFO
            ORDER BY SERVICEID`;
            result = await queryDb(selectSql,database1);
           
            for (let num of  result.recordset ){
                num.STARTTIME= moment(num.STARTTIME).utc().format('HH:mm:ss')
                num.ENDTIME= moment(num.ENDTIME).utc().format('HH:mm:ss')
                num.STARTTIME2= moment(num.STARTTIME2).utc().format('HH:mm:ss')
                num.ENDTIME2= moment(num.ENDTIME2).utc().format('HH:mm:ss')
           }
    
     
       return result.recordset;

    }


    
    
    

}
module.exports = crudDichvu;