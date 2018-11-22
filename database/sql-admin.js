const queryDb = require('./db');
const databaseInfo = require('./databaseInfo');

class admin {
    static async signIn_admin(username, password) {
    
        let database =databaseInfo
        let selectSql = `
        SELECT * FROM ADMINS WHERE UserName = '${username}'
        `
        let result = await queryDb(selectSql, database);
     
        if (!result.rowsAffected[0]) throw new Error('account khong ton tai');
        let {PassUser,MaNV}=result.recordset[0]
        if(PassUser!==password) throw new Error('password không đúng');
        
     
        return {MaNV};
     
    }
    static async getRules (MaNV) {
      let database =databaseInfo
      let   selectSql = `
         SELECT 
                        dbo.ADMINROLES.MaQuyen
                FROM   dbo.ADMINS,dbo.ADMINROLES
                WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
                AND    dbo.ADMINS.MaNV ='${MaNV}'
        `
      let   result = await queryDb(selectSql, database);
      return result
    }

    
    static async changePassword(username,passwordOld,passwordNew) {
        let selectSql = 'SELECT * FROM admin WHERE username = $1';
        let result = await queryDb(selectSql, [username]);
        if (!result.rows[0]) throw new Error('Email khong ton tai');
        const { password } = result.rows[0];
       
        const same = await compare(passwordOld, password);
        if (!same)throw new Error('Sai password ');
       
        const encrypted = await hash(passwordNew, 8);
         selectSql = 'Update admin set password =$1 WHERE username = $2';
         result = await queryDb(selectSql, [encrypted,username]);
         if(result.rowCount===0) throw new Error (" có lổi ko thay đổi password được")
        return ;
    }
}
module.exports = admin;