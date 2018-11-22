const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');


class donviInfo {
    static async get_donviInfo() {
        let database =databaseInfo
        const selectSql =
            `SELECT OFFICEID,OFFICENAME,ORDERINDEX,ADDRESS  FROM dbo.OFFICE
        WHERE  ISACTIVE=1
        ORDER BY ORDERINDEX`;
        const result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không có đơn vị ');
        return result;
    }
    
    static async get_officeServiceInfo(OFFICEID) {
        let database =databaseInfo
        const selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        const result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
           const selectSql1 =
           `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
           ORDER BY STARTNO`;
       const result1 = await queryDb(selectSql1,database1);
       if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        return result1;
      
    }
    static async get_counterService(SERVICEID,OFFICEID) {
        let database =databaseInfo
        const selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        const result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
           const selectSql1 =
           `SELECT COUNTERID FROM dbo.COUNTERSERVICE   
           WHERE  SERVICEID='${SERVICEID}'	
           GROUP BY COUNTERID
           ORDER BY COUNTERID`;
       const result1 = await queryDb(selectSql1,database1);
       if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
          
        return result1;
      
    }
    static async get_staffsOffice(COUNTERID,OFFICEID,TABLE) {
        let database =databaseInfo
        const selectSql =
            `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
            WHERE  OFFICEID='${OFFICEID}'`;
        const result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
        let database1 ={
            user: result.recordset[0].USERNAME,
            password: result.recordset[0].PASSWORD,
            ip: result.recordset[0].IPDATABASE,
            name: result.recordset[0].DATABASENAME 
           }
           let selectSql1 =""
           if(TABLE=="GRID2")
            {
                 selectSql1 =
                `SELECT STAFFID,COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
                FROM   dbo.STAFFS
                WHERE  COUNTERID = '${COUNTERID}'       
                ORDER BY COUNTERID,StaffIDOffice`;
            }
            else    {
                 selectSql1 =
                `SELECT STAFFID,COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
                FROM   dbo.STAFFS
                WHERE  COUNTERID <> '${COUNTERID}'       
                ORDER BY COUNTERID,StaffIDOffice`;
                 }
          
       const result1 = await queryDb(selectSql1,database1);
    //    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
          
        return result1;
      
        
    }
   
    static async update_staffs(OFFICEID,COUNTERID,arrayUpdate,TABLE) {
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

        for (let num of arrayUpdate) {
         
            if(TABLE=="GRID1")
            {
            selectSql = `UPDATE dbo.STAFFS SET COUNTERID= '${COUNTERID}'
            WHERE  StaffIDOffice ='${num.StaffIDOffice}'` 
                result = await queryDb (selectSql,database1)
            }else{
                selectSql = `UPDATE dbo.STAFFS SET COUNTERID = 0
                WHERE  StaffIDOffice ='${num.StaffIDOffice}'` 
                    result = await queryDb (selectSql,database1)
            }
              
     if(result.rowsAffected===0) throw new Error ("co loi xay ra trong qua trình insert database")
        }
            return
        
    }

    static async add_staff(staff) {
      
        let database =databaseInfo
        let selectSql =
        `SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
        WHERE  OFFICEID='${staff.OFFICEID}'`;
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
       DECLARE @ID VARCHAR(5)
       IF (SELECT COUNT(STAFFID) FROM dbo.STAFFS) = 0
           SET @ID = '0'
       ELSE
           SELECT @ID = MAX(STAFFID) FROM dbo.STAFFS
           SELECT @ID = CASE
               WHEN @ID >= 0 and @ID < 9 THEN '0' + CONVERT(CHAR, CONVERT(INT, @ID) + 1)
               WHEN @ID >= 9 THEN CONVERT(CHAR, CONVERT(INT, @ID) + 1)
               END
               END
   SELECT @ID AS staffid

   INSERT INTO dbo.STAFFS
              (STAFFID
              ,StaffIDOffice
              ,LASTNAME
              ,FIRSTNAME
              ,COUNTERID
              ,STATUS
              ,STATUSTIME
              ,LOGIN
              ,StaffIDLog)
        VALUES
              (@ID				
              ,'${staff.StaffIDOffice}'			
              ,N'${staff.FIRSTNAME}'			
              ,N'${staff.LASTNAME}'					
              ,'${staff.COUNTERID}'					
              ,'0'						
              ,GETDATE()			
              ,'0'						
              ,'NULL')			
              
             
       `;
    result = await queryDb(selectSql,database1);

     selectSql =
   `SELECT STAFFID,COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
   FROM   dbo.STAFFS
   WHERE  COUNTERID = '${staff.COUNTERID}'       
   ORDER BY COUNTERID,StaffIDOffice`
    result = await queryDb(selectSql,database1);
    return  result
    
    }
    static async delete_staff(OFFICEID,COUNTERID,nhanvienDelete) {
      
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
       DELETE FROM dbo.STAFFS
       WHERE STAFFID='${nhanvienDelete}'
       `
        result = await queryDb(selectSql,database1);    

     selectSql =
   `SELECT STAFFID,COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
   FROM   dbo.STAFFS
   WHERE  COUNTERID = '${COUNTERID}'       
   ORDER BY COUNTERID,StaffIDOffice`
    result = await queryDb(selectSql,database1);
    return  result
    
    }

}
module.exports = donviInfo;