const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
const { hash, compare } = require('bcrypt');
const moment=require('moment');
class giamsatNhanvien {
    static async getstaffsMonitor(OFFICEID,allService) {
        let dateNow =new Date();
        dateNow = moment(dateNow).format('DD-MM-YYYY'); 
        dateNow="12/10/2018" 
        let returnArray=[]
        let arrayService=[]
        let arrayCounter=[]
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

 //////////// lấy ra các dịch vu/////////////                  
           let selectSql1
           let result1
           if (allService.CONTROL=="DONVI")
            {
                    selectSql1 =
                `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
                    ORDER BY STARTNO`;
                    result1 = await queryDb(selectSql1,database1);
                    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
                        arrayService=result1.recordset
            //////////// lấy ra các counter cua array dich vu/////////////         
                    for (let num of arrayService) {
                            let obj={} 
                            obj.SERVICEID=num.SERVICEID
                            obj.SERVICENAME=num.SERVICENAME
                            let idservice= Number(num.SERVICEID)
                            const selectSqlQuay=`
                            BEGIN
                            SELECT 		COUNTERID 
                            FROM    	dbo.COUNTERSERVICE
                            WHERE		SERVICEID='${idservice}'      
                            GROUP BY	COUNTERID
                            ORDER BY 	COUNTERID
                            END`
                            const resultQuay = await queryDb(selectSqlQuay,database1);
                                    for (let num of resultQuay.recordset) {
                                    num. SERVICEID =obj.SERVICEID 
                                    num. SERVICENAME =obj.SERVICENAME 
                                    arrayCounter.push(num)   
                                    }
                                }
            }
        if (allService.CONTROL=="SERVICE")
            {
                let id =Number(allService.SERVICEID)
                    selectSql1 =
                `SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
                    WHERE SERVICEID ='${id}' `;
                    result1 = await queryDb(selectSql1,database1);
                    if (!result1.rowsAffected[0]) throw new Error('không load được dịch vụ của đơn vị được chọn ');
                        arrayService=result1.recordset
          //////////// lấy ra các counter cua array dich vu/////////////         
                 for (let num of arrayService) {
                        let obj={} 
                        obj.SERVICEID=num.SERVICEID
                        obj.SERVICENAME=num.SERVICENAME
                        let idservice= Number(num.SERVICEID)
                         const selectSqlQuay=`
                         BEGIN
                         SELECT 		COUNTERID 
                         FROM    	dbo.COUNTERSERVICE
                         WHERE		SERVICEID='${idservice}'      
                         GROUP BY	COUNTERID
                         ORDER BY 	COUNTERID
                         END`
                         const resultQuay = await queryDb(selectSqlQuay,database1);
                                for (let num of resultQuay.recordset) {
                                 num. SERVICEID =obj.SERVICEID 
                                 num. SERVICENAME =obj.SERVICENAME 
                                 arrayCounter.push(num)   
                                 }
                             }
             }
        if (allService.CONTROL=="COUNTER")
                    {
                        let objCounter ={}
                        objCounter.COUNTERID= Number(allService.COUNTERID)
                        objCounter.SERVICEID= Number(allService.SERVICEID)
                        arrayCounter.push(objCounter) 
                    }

 //////////// lấy ra các thông tin nhan vien đe giam sat/////////////       
             for (let num of arrayCounter) {
                let obj={}
                // obj.SERVICENAME=num.SERVICENAME
                // obj.SERVICEID=num.SERVICEID
                // obj.SERVICENAME=num.SERVICENAME
                  obj.Quay=num.COUNTERID
              
 ///// nhan viên thuộc quầy.
                   let selectSqlInfo=`
                    SELECT 		dbo.STAFFS.StaffIDOffice AS 'MNV',
                    CONCAT(dbo.STAFFS.StaffIDOffice,'-',dbo.STAFFS.LASTNAME,' ',dbo.STAFFS.FIRSTNAME) AS 'Nhanvien'
                        FROM		dbo.STAFFS,dbo.CUSTOMERS			
                        WHERE		dbo.STAFFS.COUNTERID='${num.COUNTERID}'   
                                    AND dbo.CUSTOMERS.STATUS = '1' 
                                    AND dbo.STAFFS.COUNTERID=dbo.CUSTOMERS.COUNTERID`
                   let resultInfo = await queryDb(selectSqlInfo,database1);       
                    obj.Nhanvien = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].Nhanvien 
                   
                   
       ///// so dang phuc vu          
                 selectSqlInfo=  `SELECT dbo.CUSTOMERS.CUSTOMERNO AS 'SODANGPHUCVU'
                    FROM    	dbo.CUSTOMERS 
                    WHERE		dbo.CUSTOMERS.STATUS = '1' AND dbo.CUSTOMERS.COUNTERID = '${num.COUNTERID}' 
                                AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                    `;
                 resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.SODANGPHUCVU = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].SODANGPHUCVU 
                let sodangphucvu= Number(obj.SODANGPHUCVU)
              
    //////////thời gian phuc vu hien tai
                 selectSqlInfo=  `BEGIN 
                 SELECT     DATEDIFF("SECOND",dbo.CUSTOMERS.SERVINGTIME, '2018-10-12 08:59:00') as TG_PV_HIENTAI 
                 FROM		dbo.CUSTOMERS 
                 WHERE		dbo.CUSTOMERS.CUSTOMERNO ='${sodangphucvu}'    
                            AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='${dateNow}' 
                 END
                 `;
                 resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                 obj.TG_PV_HIENTAI = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].TG_PV_HIENTAI 
   
                 
                 // //  /////////phục vụ lâu nhất//////////
                selectSqlInfo=  `BEGIN
                SELECT 	    MAX(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)) AS MAXSERVETIME				
                FROM    	dbo.CUSTOMERS
                WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.COUNTERID ='${num.COUNTERID}' AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                END`;
                resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.MAXSERVETIME = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].MAXSERVETIME 
    
    // //  ////////thoi gian phuc vu trung bình//////////
    // //  ////////thoi gian phuc cho trung bình//////////
                selectSqlInfo=  ` BEGIN
                SELECT		
                            ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME,		
                            ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.TOCOUNTERTIME, dbo.CUSTOMERS.SERVINGTIME)), 0) AS AVGWAITTIME,	
                            MAX(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)) AS MAXSERVETIME				  
                FROM    	dbo.CUSTOMERS
                WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.COUNTERID ='${num.COUNTERID}' AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}'
                END`;
                resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.AVGSERVETIME = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].AVGSERVETIME 
                obj.AVGWAITTIME =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].AVGWAITTIME 
   
   // //  ////////thoi gian nghỉ giửa 2 số thứ tự//////////
                selectSqlInfo=  `BEGIN
                SELECT		DATEDIFF("SECOND", dbo.CUSTOMERS.FINISHTIME,'2018-10-12 08:59:00') AS 'TG_OFF_2SO'  
                FROM    	dbo.CUSTOMERS
                WHERE		dbo.CUSTOMERS.CUSTOMERNO='${sodangphucvu}' AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '${dateNow}' 
                END`;
                resultInfo = await queryDb(selectSqlInfo,database1);
                // if (!resultInfo.rowsAffected[0]) throw new Error('không load được thông tin giam sat dich vụ ');
                obj.TG_OFF_2SO = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].TG_OFF_2SO 
             
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
                obj.WAITTIMEMAX = ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].WAITTIMEMAX 
                obj.SERVICETIMEMAX =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].SERVICETIMEMAX 
                obj.DISCOUNTITIMEMAX =  ( resultInfo.recordset[0]== undefined || resultInfo.recordset[0]== null ) ? null : resultInfo.recordset[0].DISCOUNTITIMEMAX 
               
                returnArray.push(obj)
                }

                if(allService.CONTROL=="DONVI")
                   {
                        let obj1={}
                        obj1.arrayService=arrayService
                        returnArray.push(obj1)
                   } 

                   if(allService.CONTROL=="SERVICE")
                   {
                        let obj1={}
                        obj1.arrayCounter=arrayCounter
                        returnArray.push(obj1)
                   }
               
                return returnArray;
        }  
      
}
module.exports = giamsatNhanvien;