//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const giamsatDichvu = require('../database/sql-giamsatDichvu');
   
    app.post('/giamsatDichvu',jsonParser,checkApi, function (req, res) {
        let {OFFICEID}= req.body.selectedOption
        console.log(req.body)
        let {allService}= req.body
        giamsatDichvu.getserviceMonitor(OFFICEID,allService)
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
