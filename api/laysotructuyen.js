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
            res.send(JSON.stringify([{ control:"noOk"}]));
           
        });
     });
     app.post('/getNumber',jsonParser, function (req, res) {
        let{SERVICEID,OFFICEID}=req.body
        let{INFOCUSTOMERS}=req.body
        // console.log(SERVICEID,OFFICEID,INFOCUSTOMERS)
        laysotructuyen.get_showNumber(OFFICEID,SERVICEID,INFOCUSTOMERS)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
           
        });
     });

   

      
                 
    }