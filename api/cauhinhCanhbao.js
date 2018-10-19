//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const canhbao = require('../database/sql-cauhinhCanhbao');
   
    app.post('/canhbao',jsonParser,checkApi, function (req, res) {
        let {OFFICEID}= req.body
        let {SERVICEID}= req.body.selectedOption
        
        console.log(req.body)
    canhbao.get_serviceWarning(OFFICEID,SERVICEID)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{control:"noOk"}]));
           
        });
     });

     app.put('/canhbao',jsonParser,checkApi, function (req, res) {
        let {OFFICEID}= req.body
        let {SERVICEID}= req.body
        let {index}= req.body
        let {selectedOption}= req.body
      
    canhbao.update_serviceWarning(OFFICEID,SERVICEID,selectedOption,index)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify([{control:"Ok"}]));
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{control:"noOk"}]));
           
        });
     });
   
     app.post('/checkboxWarning',jsonParser,checkApi, function (req, res) {
       let {OFFICEID } =req.body
    canhbao.get_checkboxWarning(OFFICEID)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{control:"noOk"}]));
           
        });
     });
     app.put('/checkboxWarning',jsonParser,checkApi, function (req, res) {
        let {OFFICEID } =req.body
        let {selectedOption } =req.body
     canhbao.update_checkboxWarning(OFFICEID,selectedOption)
         .then(result => {
            //  console.log(result)
             res.send(JSON.stringify([{control:"Ok"}]));
             })
         .catch(err => {
             console.log(err)
             res.send(JSON.stringify([{control:"noOk"}]));
            
         });
      });

     
    }