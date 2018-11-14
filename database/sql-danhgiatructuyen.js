const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');


class danhgiatructuyen {
    
    static async get_ratingInfo(code) {
        let obj={}
        let returnArray=[]
        let database =databaseInfo
        let selectSql =
        `SELECT	dbo.REGISTRATIONFORM.OFFICEID AS  OFFICEID,
		dbo.REGISTRATIONFORM.ID AS  REGISTRATIONFORMID,
		dbo.REGISTRATIONFORMINFO.CUSTOMERSID AS CUSTOMERSID		
        FROM	dbo.REGISTRATIONFORM,dbo.REGISTRATIONFORMINFO
        WHERE	dbo.REGISTRATIONFORM.SERIAL='${code}'
        AND		dbo.REGISTRATIONFORMINFO.REGISTRATIONFORMID=dbo.REGISTRATIONFORM.ID
        `;
    let result = await queryDb(selectSql,database);
    if (!result.rowsAffected[0]) throw new Error('không load được thông tin để thực hiện đánh gia nhân viên hoặc mã xác thực ko tồn tại ');
      obj.OFFICEID=result.recordset[0].OFFICEID 
      obj.REGISTRATIONFORMID=result.recordset[0].REGISTRATIONFORMID 
      obj.CUSTOMERSID=result.recordset[0].CUSTOMERSID 
      obj.SERIAL=code
       
      selectSql =`
        SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD,OFFICENAME AS 'donvi'  
      FROM dbo.OFFICE
      WHERE  OFFICEID='${obj.OFFICEID}'`;
         result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được thông tin của đơn vị để đánh giá nhân viên ');
        obj.donvi=result.recordset[0].donvi 
      
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
           const selectSql1 =
           `
           SELECT 	   dbo.STAFFS.StaffIDOffice   AS 'mnv',
                       dbo.STAFFS.STAFFID         AS 'staffid',
                       dbo.CUSTOMERS.CUSTOMERNO   AS 'customerno',
                       CONCAT(dbo.STAFFS.StaffIDOffice,'-',dbo.STAFFS.LASTNAME,' ',dbo.STAFFS.FIRSTNAME) AS 'nhanvien'
           FROM		dbo.STAFFS,dbo.CUSTOMERS			
           WHERE		dbo.CUSTOMERS.ID='${obj.CUSTOMERSID}'
                       AND dbo.STAFFS.STAFFID=dbo.CUSTOMERS.StaffID
           `;
       const result1 = await queryDb(selectSql1,database1);
       if (!result1.rowsAffected[0]) throw new Error('không load được thông tin của nhân viên để đánh giá ');
        
       obj.mnv=result1.recordset[0].mnv 
       obj.staffid=result1.recordset[0].staffid 
       obj.customerno=result1.recordset[0].customerno 
       obj.nhanvien=result1.recordset[0].nhanvien 

          
      selectSql =`
      SELECT * FROM dbo.Assess AS Assess`;
       result = await queryDb(selectSql,database);
      if (!result.rowsAffected[0]) throw new Error('không load được các tiêu chí  để đánh giá nhân viên ');
      obj.Assess=result.recordset
      returnArray.push(obj)
        return returnArray
    }
    
    static async update_ratingInfo(updateRating) {
        let database =databaseInfo
        let dateNow =new Date();
        dateNow = moment(dateNow).utc().format('DD/MM/YYYY'); 
      let selectSql =`
        SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD,OFFICENAME AS 'donvi'  
      FROM dbo.OFFICE
      WHERE  OFFICEID='${updateRating.OFFICEID}'`;
      let   result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được thông tin của đơn vị để đánh giá nhân viên ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
         
         selectSql =`
          delete  FROM dbo.RATINGS
         WHERE  CustomerNo='${updateRating.customerno}'
           AND CONVERT(CHAR(10), VOTETIME, 103) = '${dateNow}'
               
         `;
         result = await queryDb(selectSql,database1);

         selectSql =
           `
           BEGIN
           INSERT INTO dbo.RATINGS
           (
		    VOTETIME
           ,STAFFID
           ,CustomerNo
           ,BEST
           ,GOOD
           ,AVERAGE
           ,POOR
           )
     VALUES
           (
		   GETDATE()		
           ,'${updateRating.staffid}'			
           ,'${updateRating.customerno}'			
           ,'${updateRating.BEST}'			
           ,'${updateRating.GOOD}'			
           ,'${updateRating.AVERAGE}'			
           ,'${updateRating.POOR}'			
           )

END
           `;
       result = await queryDb(selectSql,database1);
       if (!result.rowsAffected[0]) throw new Error('không cập nhật thông tin của nhân viên để đánh giá ');
         
       
         selectSql =`
         SELECT Max(ID) as LastID FROM dbo.RATINGS
         `;
         result = await queryDb(selectSql,database1);
           if (!result.rowsAffected[0]) throw new Error('không load được id rating ');
           let LastID = result.recordset[0].LastID
        
           selectSql =`
           delete  FROM dbo.RATINGSINFO
          WHERE  SERIAL='${updateRating.SERIAL}'
          `;
          result = await queryDb(selectSql,database);

          selectSql =`
           BEGIN
           DECLARE @ID uniqueidentifier
           SET @ID = NEWID()
           
           INSERT INTO dbo.RATINGSINFO
                      (ID
                      ,RATINGSID
                      ,REGISTRATIONFORMID
                      ,SERIAL)
                VALUES
                      (@ID														
                      ,'${LastID}'													
                      ,'${updateRating.REGISTRATIONFORMID}'				
                      ,'${updateRating.SERIAL}'												
                      )
           END
        `;
        result = await queryDb(selectSql,database);
            if (!result.rowsAffected[0]) throw new Error('không insert được ratinginfo ');
    
        return 
    }

}
module.exports = danhgiatructuyen;