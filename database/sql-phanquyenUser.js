const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');
// const { hash, compare } = require('bcrypt');


class phanquyenUser {
    static async get_userInfo() {
       
        let arrayReturn=[]
        let database =databaseInfo
        let selectSql =
            `
            SELECT 
            dbo.ADMINS.MaNV,
            dbo.ADMINS.UserName,
            dbo.ADMINS.PassUser,
            dbo.ADMINS.Ho,
            dbo.ADMINS.Ten,
            dbo.ADMINS.Email,
            CONCAT(dbo.ADMINS.Ho,' ',dbo.ADMINS.Ten) As 'HoTen'
     FROM   dbo.ADMINS
        `;
        let result = await queryDb(selectSql,database);
        // if (!result.rowsAffected[0]) throw new Error('không có account nào được load ');
        for (let num of result.recordset) {
            let obj={}
            obj.MaNV=num.MaNV
            obj.Ho=num.Ho
            obj.Ten=num.Ten
            obj.Email=num.Email
            obj.HoTen=num.HoTen
            obj.UserName=num.UserName
            obj.PassUser=num.PassUser
            selectSql =
                `  
                         SELECT 
                        dbo.ADMINROLES.MaQuyen
                FROM   dbo.ADMINS,dbo.ADMINROLES
                WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
                AND    dbo.ADMINS.MaNV ='${num.MaNV}'
                `
            result = await queryDb(selectSql,database);
            obj.MaQuyen=  ( result.recordset[0]== undefined || result.recordset[0]== null ) ? null : result.recordset
            arrayReturn.push(obj)
        }
            selectSql =
            `  
                    SELECT * from
                    dbo.GROUPADMIN
            `
            result = await queryDb(selectSql,database);
            let obj1={}
            obj1.arrayRules=result.recordset
            arrayReturn.push(obj1)
           
        return arrayReturn;
    }
    static async add_userInfo(obj) {
        
         let arrayReturn=[]
         let database =databaseInfo
       
    let selectSql =
                    `
                    SELECT  count(dbo.ADMINS.UserName) as checkusername
                    FROM	dbo.ADMINS
                    WHERE dbo.ADMINS.UserName='${obj.username}'
                `;
     let result = await queryDb(selectSql,database);
  
     if (result.recordset[0].checkusername>0) throw new Error('account đã tồn tại ');
            selectSql =
            `
            INSERT INTO dbo.ADMINS
            (MaNV
            ,Ho
            ,Ten
            ,UserName
            ,PassUser
            ,Email)
      VALUES
            (dbo.AUTO_MANV ()	  
            ,N'${obj.ho}'			
            ,N'${obj.ten}'			
            ,'${obj.username}'		
            ,'${obj.password}'	
            ,'${obj.email}'		
            )				
        `;
  
        result = await queryDb(selectSql,database);
       
        if (!result.rowsAffected[0]) throw new Error('không thêm mới đượcc account ');
            
        selectSql =
                `
        SELECT MaNV as MaNV
        FROM   dbo.ADMINS
        WHERE  UserName ='${obj.username}'
    `;
    result = await queryDb(selectSql,database);
  
    if (!result.recordset[0]) throw new Error('không lấy được MaNV thêm mới của account ');
  
            let MaNV=result.recordset[0].MaNV

        //     selectSql =
        //     `
        //     DELETE FROM dbo.ADMINROLES
        //     WHERE MaNV='${MaNV}'
        // `;
        // result = await queryDb(selectSql,database);
        console.log(obj.MaQuyen)
        for (let num of obj.MaQuyen) {
         
                selectSql =
                `
                INSERT INTO dbo.ADMINROLES
                (MaNV
                ,MaQuyen)
        VALUES ('${MaNV}','${num}')
              
            `;
            result = await queryDb(selectSql,database);
                   
        }
          selectSql =
             `
             SELECT 
             dbo.ADMINS.MaNV,
             dbo.ADMINS.UserName,
             dbo.ADMINS.PassUser,
             dbo.ADMINS.Ho,
             dbo.ADMINS.Ten,
             dbo.ADMINS.Email,
             CONCAT(dbo.ADMINS.Ho,' ',dbo.ADMINS.Ten) As 'HoTen'
      FROM   dbo.ADMINS
         `;
          result = await queryDb(selectSql,database);
         if (!result.rowsAffected[0]) throw new Error('không có account nào được load ');
         for (let num of result.recordset) {
             let obj={}
             obj.MaNV=num.MaNV
             obj.Ho=num.Ho
             obj.Ten=num.Ten
             obj.Email=num.Email
             obj.HoTen=num.HoTen
             obj.UserName=num.UserName
             obj.PassUser=num.PassUser
             selectSql =
                 `  
                          SELECT 
                         dbo.ADMINROLES.MaQuyen
                 FROM   dbo.ADMINS,dbo.ADMINROLES
                 WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
                 AND    dbo.ADMINS.MaNV ='${num.MaNV}'
                 `
             result = await queryDb(selectSql,database);
             obj.MaQuyen=  ( result.recordset[0]== undefined || result.recordset[0]== null ) ? null : result.recordset 
           
             arrayReturn.push(obj)
         }
            //  selectSql =
            //  `  
            //          SELECT * from
            //          dbo.GROUPADMIN
            //  `
            //  result = await queryDb(selectSql,database);
            //  let obj1={}
            //  obj1.arrayRules=result.recordset
            //  arrayReturn.push(obj1)
            
         return arrayReturn;
     }
     static async delete_userInfo(maUser) {
        
         let arrayReturn=[]
         let database =databaseInfo

         let selectSql =
         `
         DELETE FROM dbo.ADMINS
         WHERE MaNV='${maUser}'
     `;
     let  result = await queryDb(selectSql,database);
          selectSql =
             `
             SELECT 
             dbo.ADMINS.MaNV,
             dbo.ADMINS.UserName,
             dbo.ADMINS.PassUser,
             dbo.ADMINS.Ho,
             dbo.ADMINS.Ten,
             dbo.ADMINS.Email,
             CONCAT(dbo.ADMINS.Ho,' ',dbo.ADMINS.Ten) As 'HoTen'
      FROM   dbo.ADMINS
         `;
          result = await queryDb(selectSql,database);
         if (!result.rowsAffected[0]) throw new Error('không có account nào được load ');
         for (let num of result.recordset) {
             let obj={}
             obj.MaNV=num.MaNV
             obj.Ho=num.Ho
             obj.Ten=num.Ten
             obj.Email=num.Email
             obj.HoTen=num.HoTen
             obj.UserName=num.UserName
             obj.PassUser=num.PassUser
             selectSql =
                 `  
                          SELECT 
                         dbo.ADMINROLES.MaQuyen
                 FROM   dbo.ADMINS,dbo.ADMINROLES
                 WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
                 AND    dbo.ADMINS.MaNV ='${num.MaNV}'
                 `
             result = await queryDb(selectSql,database);
             obj.MaQuyen=  ( result.recordset[0]== undefined || result.recordset[0]== null ) ? null : result.recordset
           
             arrayReturn.push(obj)
         }
            //  selectSql =
            //  `  
            //          SELECT * from
            //          dbo.GROUPADMIN
            //  `
            //  result = await queryDb(selectSql,database);
            //  let obj1={}
            //  obj1.arrayRules=result.recordset
            //  arrayReturn.push(obj1)
            
         return arrayReturn;
     }

     static async edit_userInfo(obj) {
        
         let arrayReturn=[]
         let database =databaseInfo
       
         let   selectSql =
            `
            UPDATE dbo.ADMINS
            SET Ho =	N'${obj.ho}'					
               ,Ten =N'${obj.ten}'					
               ,PassUser ='${obj.password}'				
          WHERE MaNV='${obj.MaNV}'
        `;
  
     let   result = await queryDb(selectSql,database);
       
        if (!result.rowsAffected[0]) throw new Error('không cập nhật đượcc account ');
     
            selectSql =
            `
            DELETE FROM dbo.ADMINROLES
            WHERE MaNV='${obj.MaNV}'
        `;
        result = await queryDb(selectSql,database);
     
        for (let num of obj.MaQuyen) {
                selectSql =
                `
                INSERT INTO dbo.ADMINROLES
                (MaNV
                ,MaQuyen)
        VALUES ('${obj.MaNV}','${num}')
              
            `;
            result = await queryDb(selectSql,database);
                   
        }
          selectSql =
             `
             SELECT 
             dbo.ADMINS.MaNV,
             dbo.ADMINS.UserName,
             dbo.ADMINS.PassUser,
             dbo.ADMINS.Ho,
             dbo.ADMINS.Ten,
             dbo.ADMINS.Email,
             CONCAT(dbo.ADMINS.Ho,' ',dbo.ADMINS.Ten) As 'HoTen'
      FROM   dbo.ADMINS
         `;
          result = await queryDb(selectSql,database);
         if (!result.rowsAffected[0]) throw new Error('không có account nào được load ');
         for (let num of result.recordset) {
             let obj={}
             obj.MaNV=num.MaNV
             obj.Ho=num.Ho
             obj.Ten=num.Ten
             obj.Email=num.Email
             obj.HoTen=num.HoTen
             obj.UserName=num.UserName
             obj.PassUser=num.PassUser
             selectSql =
                 `  
                          SELECT 
                         dbo.ADMINROLES.MaQuyen
                 FROM   dbo.ADMINS,dbo.ADMINROLES
                 WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
                 AND    dbo.ADMINS.MaNV ='${num.MaNV}'
                 `
             result = await queryDb(selectSql,database);
             obj.MaQuyen=  ( result.recordset[0]== undefined || result.recordset[0]== null ) ? null : result.recordset 
           
             arrayReturn.push(obj)
         }
            //  selectSql =
            //  `  
            //          SELECT * from
            //          dbo.GROUPADMIN
            //  `
            //  result = await queryDb(selectSql,database);
            //  let obj1={}
            //  obj1.arrayRules=result.recordset
            //  arrayReturn.push(obj1)
            
         return arrayReturn;
     }
    
   
   
}
module.exports = phanquyenUser;