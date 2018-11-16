//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const phanquyenUser = require('../database/sql-phanquyenUser');
   
    app.get('/phanquyenUser', function (req, res) {

        phanquyenUser.get_userInfo()
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
           
        });
     });
     app.post('/phanquyenUser',jsonParser, function (req, res) {
        let {obj}=req.body
                phanquyenUser.add_userInfo(obj)
                .then(result => {
                    console.log(result)
                    res.send(JSON.stringify(result))
                    })
                .catch(err => {
                    console.log(err)
                    res.send(JSON.stringify([{ control:"noOk"}]));
                   
                });
             });
             app.delete('/phanquyenUser/:maUser',jsonParser,checkApi, function (req, res) {
                let {maUser}= req.params
              
                phanquyenUser.delete_userInfo(maUser)
                .then(result => {
                    // console.log(result.recordset)
                    res.send(JSON.stringify(result))
                    })
                .catch(err => {
                    console.log(err)
                    res.send(JSON.stringify([{ control:"noOk"}]));
                   
                });
             });
             app.put('/phanquyenUser',jsonParser, function (req, res) {
                let {obj}=req.body
                        phanquyenUser.edit_userInfo(obj)
                        .then(result => {
                            console.log(result)
                            res.send(JSON.stringify(result))
                            })
                        .catch(err => {
                            console.log(err)
                            res.send(JSON.stringify([{ control:"noOk"}]));
                           
                        });
                     });
   
    }