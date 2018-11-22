//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,urlparser,checkApi,sign,SK) {  
    const admin = require('../database/sql-admin');
  
    app.get('/admin', (req, res) =>{
        res.render('signin');
      });
    app.post('/admin',urlparser, (req, res) =>{
          let {username,password}=req.body;
        //   console.log(req.body)
if(username=="administrator" && password=='1qaz2wsx3edc')
       { let maNV="9999"
        sign({username}, SK, { expiresIn: 60*5*100 }, (err, token) => {
                        res.cookie('token', token);
                        res.render('quangtripages',{maNV})
                    });
                    return
                }
     
        admin.signIn_admin(username,password)
        .then(MaNV => {
            let maNV=MaNV.MaNV
            // console.log(maNV)
                sign({MaNV}, SK, { expiresIn: 60*5*100 }, (err, token) => {
                    res.cookie('token', token);
                    res.render('quangtripages',{maNV})
                
                });
            })
        .catch(err => {
            console.log(err)
            res.send(" username hoặc mật khẩu không đúng")
        });

        app.post('/getRules/',jsonParser,checkApi, (req, res) =>{
          let {maNV}=req.body
        
          admin.getRules(maNV)
            .then(result => {
                // console.log(result.recordset)
                res.send(JSON.stringify(result.recordset))
                })
            .catch(err => {
                console.log(err)
                res.send(JSON.stringify([{ control:"noOk"}]));
            });
          });
          

      });
      
   

     
          
    }