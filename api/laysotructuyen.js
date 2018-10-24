//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const laysotructuyen = require('../database/sql-laysotructuyen');
   
    app.get('/getNumber/:OFFICEID/:SERVICEID',jsonParser, function (req, res) {
        let{SERVICEID,OFFICEID}=req.params
        laysotructuyen.get_waitNumber(OFFICEID,SERVICEID)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify({ control:"noOk"}));
           
        });
     });

   

      
                 
    }