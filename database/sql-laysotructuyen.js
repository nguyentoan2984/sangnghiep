const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');

class laysotructuyen {
    static async get_waitNumber(OFFICEID,SERVICEID) {
        let database =databaseInfo
        let dateNow =new Date();
        dateNow = moment(dateNow).utc().format('DD/MM/YYYY')
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
       let obj={}
       let returnArray=[]
         selectSql =
       `SELECT		COUNT(CUSTOMERNO) as soluongdangcho
       FROM		dbo.CUSTOMERS
       WHERE       STATUS = 0
                   AND	SERVICEID='${SERVICEID}'
                   AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' `;
         result   = await queryDb(selectSql,database1);
//    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        // console.log(result.recordset)       
obj.soluongdangcho = ( result.recordset[0].soluongdangcho== undefined || result.recordset[0].soluongdangcho== null ) ? 0 : result.recordset[0].soluongdangcho    
        selectSql =
        `BEGIN
        SELECT		
                   GETDATE() AS TIMENOW,
                    ROUND(AVG(DATEDIFF("MINUTE", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME		
        FROM    	dbo.CUSTOMERS
        WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.SERVICEID ='${SERVICEID}'
                    AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='${dateNow}'
        END `;
          result   = await queryDb(selectSql,database1);
 //    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
         obj.AVGSERVETIME = ( result.recordset[0].AVGSERVETIME== undefined || result.recordset[0].AVGSERVETIME== null ) ? 0 : result.recordset[0].AVGSERVETIME    
         obj.TIMENOW = ( result.recordset[0].TIMENOW== undefined || result.recordset[0].TIMENOW== null ) ? 0 : result.recordset[0].TIMENOW    
        let timeGiaodich=obj.soluongdangcho*obj.AVGSERVETIME
         obj.TIMENOW=moment( obj.TIMENOW).utc().format()
         timeGiaodich=moment(obj.TIMENOW).add(timeGiaodich,'minutes')
        //  obj.timeGiaodich=timeGiaodich
         obj.timeGiaodich= moment(timeGiaodich).utc().format('DD/MM/YYYY  HH:mm:ss')
         returnArray.push(obj)
        return returnArray;
    }
    static async get_showNumber(OFFICEID,SERVICEID,INFOCUSTOMERS) {
        let database =databaseInfo
        let dateNow =new Date();
        dateNow = moment(dateNow).utc().format('DD/MM/YYYY')
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
       let obj={}
       let returnArray=[]
         selectSql =
       `BEGIN  
            SELECT GETDATE() AS timeNow,STARTNO, ENDNO, ISSUEDNO, STARTTIME, ENDTIME, STARTTIME2, ENDTIME2, RESET
            FROM SERVICEINFO
            WHERE SERVICEID = '${SERVICEID}'
            END `;
         result   = await queryDb(selectSql,database1);
   if (!result.rowsAffected[0]) throw new Error('không load được các thông số của dịch vụ trong bảng SERVICEINFO ');
        // console.log(result.recordset)       
        
        let {timeNow,number, STARTNO,ENDNO,STARTTIME,ENDTIME,STARTTIME2,ENDTIME2,ISSUEDNO}=result.recordset[0]
        let status=""
        timeNow = moment(timeNow).utc().format('HH:mm:ss')
        STARTTIME = moment(STARTTIME).utc().format('HH:mm:ss')
        ENDTIME = moment(ENDTIME).utc().format('HH:mm:ss')
        STARTTIME2 = moment(STARTTIME2).utc().format('HH:mm:ss')
        ENDTIME2 = moment(ENDTIME2).utc().format('HH:mm:ss')
        // console.log(timeNow,STARTTIME,ENDTIME,STARTTIME2,ENDTIME2)
        if (timeNow < STARTTIME || ENDTIME2 < timeNow ||  (timeNow > ENDTIME && timeNow < STARTTIME2 ))
         {
            status ="“ngoài thời gian phục vụ, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ tr"
            number=0
            obj.number=number
            obj.status=status
            returnArray.push(obj)
            return returnArray;

        }
            else {
                number = Number(ISSUEDNO) + 1;
                status="ok"
             if( number < Number(STARTNO)) {   number = STARTNO,
                                                status="ok"}
                    if(number > Number( ENDNO) )	{  number = 0, 
                                                      status="“Số đăng ký đã được cấp hết, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ"
                                                      obj.number=number
                                                      obj.status=status
                                                      returnArray.push(obj)
                                                      return returnArray;
                                                   
                                                    }
               obj.number=number
               obj.status=status
               selectSql =
                        `  
                        BEGIN
                        DECLARE @SERIAL VARCHAR(6)
                        SET     @SERIAL=LEFT(NEWID(),6)
                        WHILE   (EXISTS(SELECT SERIAL FROM dbo.REGISTRATIONFORM WHERE SERIAL =@SERIAL))
                        BEGIN    SET @SERIAL=LEFT(NEWID(),6)
                        END
                        DECLARE @ID uniqueidentifier
                        SET @ID = NEWID()
                        SELECT  @SERIAL  AS 'SERIAL',@ID AS 'ID'
                        END
                                               `;
               result   = await queryDb(selectSql,database);
               console.log(result)
               obj.serial=result.recordset[0].SERIAL
               obj.id=result.recordset[0].ID
               returnArray.push(obj)
//////////// thưc hiện ghi vào bảng customers/////////////
                selectSql =
                `  
                INSERT INTO dbo.CUSTOMERS (CUSTOMERNO,SERVICEID,TOCOUNTERTIME,STATUS,ISSUEDFROM)
                VALUES      ('${obj.number}','${SERVICEID}',GETDATE(),'0','1') 
                                    `;
                result   = await queryDb(selectSql,database1);    
                if (!result.rowsAffected[0]) throw new Error('không cập nhật được đăng ký số mới vào bảng customers ');
//////////// thưc hiện ghi vào bảng REGISTRATIONFORM/////////////      
              let servingtime=moment(obj.timeGiaodich).format('YYYY-MM-DD  HH:mm:ss')
                selectSql =
                `  
                INSERT INTO dbo.REGISTRATIONFORM
                (ID
                ,DATE
                ,OFFICEID
                ,SERVICEID
                ,FIRSTNAME
                ,LASTNAME
                ,ADDRESS
                ,EMAIL
                ,IDENTITYCARD
                ,MOBILEPHONE
                ,FACEBOOK
                ,CUSTOMERNO
                ,SERIAL         
                ,SERVINGTIME    
                ,ISSUEDFROM)    
          VALUES
                ('${obj.id}'
                ,GETDATE()
                ,'${OFFICEID}'
                ,'${SERVICEID}'
                ,'${INFOCUSTOMERS.ho}'
                ,'${INFOCUSTOMERS.ten}'
                ,'${INFOCUSTOMERS.diachi}'
                ,'${INFOCUSTOMERS.email}'
                ,'${INFOCUSTOMERS.cmnd}'
                ,'${INFOCUSTOMERS.didong}'
                ,'Null'
                ,'${obj.number}'
                , '${obj.serial}'                  
                ,'${servingtime}'      
                ,'1')     
                                    `;
                result   = await queryDb(selectSql,database);    
                if (!result.rowsAffected[0]) throw new Error('không cập nhật được đăng ký số mới vào bảng REGISTRATIONFORM ');
 
 //////////////////////// ghi vào bảng serviceinfo/////////////
                selectSql =
                `  
                UPDATE dbo.SERVICEINFO 
                SET    ISSUEDNO='${obj.number}'    
                WHERE  SERVICEID='${SERVICEID}'
                                    `;
                result   = await queryDb(selectSql,database1);    
                if (!result.rowsAffected[0]) throw new Error('không cập nhật được đăng ký số mới vào bảng SERVICEINFO ');       
//////////////////////// ghi vào bảng registrationfrominfo/////////////
           selectSql =
           `  
           SELECT ID AS CUSTOMERSID
           FROM		 dbo.CUSTOMERS
           WHERE		 CUSTOMERNO ='${obj.number}'   
           AND			 CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                               `;
           result   = await queryDb(selectSql,database1);    
           if (!result.rowsAffected[0]) throw new Error('không lấy CUSTOMERSID ');       
            let CUSTOMERID=result.recordset[0].CUSTOMERSID       
          
            selectSql =
           `  
           BEGIN
           DECLARE @ID uniqueidentifier
           SET @ID = NEWID()
           INSERT INTO dbo.REGISTRATIONFORMINFO
                      (ID
                      ,REGISTRATIONFORMID
                      ,CUSTOMERSID)
                VALUES
                      (NEWID()			
                      ,'${obj.id}'			
                      ,'${CUSTOMERID}')		
           END
                               `;
           result   = await queryDb(selectSql,database);    
           if (!result.rowsAffected[0]) throw new Error('không cập nhật được đăng ký số mới vào bảng REGISTRATIONFORMINFO ');       

            }
            return returnArray;
    }


//////////////////////////////////    
}
module.exports = laysotructuyen;