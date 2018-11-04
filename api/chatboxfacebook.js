//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    // const donviInfo = require('../database/sql-donviInfo');
   
    app.get('/webhook', function (req, res) {
        donviInfo.get_donviInfo()
        .then(result => {
            // console.log(result.recordset)
            res.send(JSON.stringify(result.recordset))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
           
        });
     });

    
    }