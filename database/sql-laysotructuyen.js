const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');

class laysotructuyen {
    static async get_waitNumber(OFFICEID,SERVICEID) {
        let database =databaseInfo
        let dateNow =new Date();
        dateNow = moment(dateNow).format('DD/MM/YYYY')
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
        console.log(result.recordset)       
obj.soluongdangcho = ( result.recordset[0].soluongdangcho== undefined || result.recordset[0].soluongdangcho== null ) ? 0 : result.recordset[0].soluongdangcho    
        selectSql =
        `BEGIN
        SELECT		
                    ROUND(AVG(DATEDIFF("MINUTE", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME		
        FROM    	dbo.CUSTOMERS
        WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.SERVICEID ='${SERVICEID}'
                    AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='${dateNow}'
        END `;
          result   = await queryDb(selectSql,database1);
 //    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
         obj.AVGSERVETIME = ( result.recordset[0].AVGSERVETIME== undefined || result.recordset[0].AVGSERVETIME== null ) ? 0 : result.recordset[0].AVGSERVETIME    
        returnArray.push(obj)
        return returnArray;
    }
}
module.exports = laysotructuyen;