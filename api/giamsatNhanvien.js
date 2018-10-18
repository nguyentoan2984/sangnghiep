//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const giamsatNhanvien = require('../database/sql-giamsatNhanvien');
   
    app.post('/giamsatNhanvien',jsonParser, function (req, res) {
        let {OFFICEID}= req.body.selectedOption
        console.log(req.body)
        let {allService}= req.body
        giamsatNhanvien.getstaffsMonitor(OFFICEID,allService)
        .then(result => {
            console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify({ control:"noOk"}));
        });
     });

    
    }
