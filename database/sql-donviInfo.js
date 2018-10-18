const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
const { hash, compare } = require('bcrypt');


class donviInfo {
    static async get_donviInfo() {
        let database =databaseInfo
        const selectSql =
            `SELECT OFFICEID,OFFICENAME,ORDERINDEX  FROM dbo.OFFICE
        WHERE  ISACTIVE=1
        ORDER BY ORDERINDEX`;
        const result = await queryDb(selectSql,database);
        if (!result.rowsAffected[0]) throw new Error('không có đơn vị ');
        return result;
    }
    
    static async get_officeServiceInfo(OFFICEID) {
        let database ={
            user: 'bquser',
            password: 'bqpassword',
            ip: '45.117.171.3', 
            name: 'BQDB' 
           }
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
        let database ={
            user: 'bquser',
            password: 'bqpassword',
            ip: '45.117.171.3', 
            name: 'BQDB' 
           }
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
           console.log(result1)
        return result1;
      
    }
    static async get_staffsOffice(COUNTERID,OFFICEID,TABLE) {
        let database ={
            user: 'bquser',
            password: 'bqpassword',
            ip: '45.117.171.3', 
            name: 'BQDB' 
           }
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
                `SELECT COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
                FROM   dbo.STAFFS
                WHERE  COUNTERID = '${COUNTERID}'       
                ORDER BY COUNTERID,StaffIDOffice`;
            }
            else    {
                 selectSql1 =
                `SELECT COUNTERID AS QUAY,StaffIDOffice,CONCAT(StaffIDOffice,'-',LASTNAME,' ',FIRSTNAME) AS 'NAME'
                FROM   dbo.STAFFS
                WHERE  COUNTERID <> '${COUNTERID}'       
                ORDER BY COUNTERID,StaffIDOffice`;
                 }
          
       const result1 = await queryDb(selectSql1,database1);
    //    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
           console.log(result1)
        return result1;
      
        
    }
   
    static async update_staffs(OFFICEID,COUNTERID,arrayUpdate,TABLE) {
        let database ={
            user: 'bquser',
            password: 'bqpassword',
            ip: '45.117.171.3', 
            name: 'BQDB' 
           }
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
            console.log(num.StaffIDOffice)
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
    console.log(result)
    console.log("ghicong");
        }
        
    }

}
module.exports = donviInfo;