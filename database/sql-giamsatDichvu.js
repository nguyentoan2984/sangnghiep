const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');
const moment=require('moment');

class giamsatDichvu {
    static async getserviceMonitor(OFFICEID,allService) {
        let dateNow =new Date();
        dateNow = moment(dateNow).format('DD-MM-YYYY'); 
        // dateNow="12/10/2018" 
        let returnArray=[]
        let arrayService=[]
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
           let selectSql1
           if (allService=="All")
                {
                     selectSql1 =
                    `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
                    ORDER BY STARTNO`;
                }
                else{
                    let id =Number(allService)
                     selectSql1 =
                    `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
                    WHERE SERVICEID ='${id}' `;
              }
        const result1 = await queryDb(selectSql1,database1);
        if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
            //  console.log(result1)
            arrayService=result1.recordset
             for (let num of result1.recordset) {
       ///// so dang phuc vu          
                let obj={}
                obj.SERVICENAME=num.SERVICENAME
                obj.SERVICEID=num.SERVICEID
                let selectSqlInfo=  `SELECT	MAX(dbo.CUSTOMERS.CUSTOMERNO) as SODANGPHUCVU
                FROM    	dbo.CUSTOMERS 
                WHERE		dbo.CUSTOMERS.SERVICEID='${num.SERVICEID}'
                            AND dbo.CUSTOMERS.STATUS = '1' 
                            AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='${dateNow}' 
                `;
                let resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                    obj.SODANGPHUCVU = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].SODANGPHUCVU 
                    let sodangphucvu= Number (resultInfo.recordset[0].SODANGPHUCVU)
    //////////thời gian phuc vu hien tai
                 selectSqlInfo=  `BEGIN
                 SELECT      DATEDIFF("SECOND",dbo.CUSTOMERS.SERVINGTIME,GETDATE()) as TG_PV_HIENTAI
                 FROM		dbo.CUSTOMERS 
                 WHERE		dbo.CUSTOMERS.CUSTOMERNO ='${sodangphucvu}'					
                            AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                 END
                 `;
                 resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                 obj.TG_PV_HIENTAI = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].TG_PV_HIENTAI 
    //  /////////thoi gian chờ lâu nhất//////////
                selectSqlInfo=  `BEGIN
                SELECT
                        MAX(DATEDIFF("SECOND", dbo.CUSTOMERS.TOCOUNTERTIME, GETDATE())) AS MAXWAITTIME 
                FROM    dbo.CUSTOMERS
                WHERE   dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.SERVICEID ='${num.SERVICEID}' 
                        AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='${dateNow}' 
                
                END`;
                resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.MAXWAITTIME = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].MAXWAITTIME 
    
    //  ////////thoi gian phuc vu trung bình//////////
    //  ////////thoi gian phuc cho trung bình//////////
                selectSqlInfo=  ` BEGIN
                SELECT		
                ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME,		 
                ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.TOCOUNTERTIME, dbo.CUSTOMERS.SERVINGTIME)), 0) AS AVGWAITTIME	
                FROM    	dbo.CUSTOMERS
                WHERE   	dbo.CUSTOMERS.STATUS = '1' 
                            AND dbo.CUSTOMERS.SERVICEID ='${num.SERVICEID}'
                            AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                             
                END`;
                resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.AVGSERVETIME = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].AVGSERVETIME 
                obj.AVGWAITTIME =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].AVGWAITTIME 
     ///////////// data canh bao//////////
                    selectSqlInfo=  ` SELECT  
                    WAITTIMEMAX ,      
                    SERVICETIMEMAX,   
                    DISCOUNTITIMEMAX
                    FROM 	dbo.SYSTEMCONFIGSERVICEINFO
                    WHERE   SERVICEID='${num.SERVICEID}' 
                            AND OFFICEID='${OFFICEID}'
                    `;
                    resultInfo = await queryDb(selectSqlInfo,database); /// lấy database brand
             // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                ///////////////////////////// end for ////////////////        
                obj.WAITTIMEMAX = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].WAITTIMEMAX 
                obj.SERVICETIMEMAX =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].SERVICETIMEMAX 
                obj.DISCOUNTITIMEMAX =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].DISCOUNTITIMEMAX 
                returnArray.push(obj)
                }
               
                return returnArray;
        }  
      
}
module.exports = giamsatDichvu;