//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const crudDichvu = require('../database/sql-crudDichvu');
   
    app.get('/crudDichvu/:OFFICEID',checkApi, function (req, res) {
        let {OFFICEID}= req.params
        // console.log(OFFICEID)
        crudDichvu.get_crudService(OFFICEID)
        .then(result => {
            console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
     app.post('/crudDichvu/',jsonParser,checkApi, function (req, res) {
        let {Infoservice,OFFICEID}= req.body
        // console.log(req.body)
        crudDichvu.add_crudService(Infoservice,OFFICEID)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
     app.delete('/crudDichvu/:OFFICEID/:serviceidDelete',jsonParser,checkApi, function (req, res) {
        let {serviceidDelete,OFFICEID}= req.params
        // console.log(req.params)
        crudDichvu.delete_crudService(serviceidDelete,OFFICEID)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
     app.put('/crudDichvu/',jsonParser,checkApi, function (req, res) {
        let {Infoservice,OFFICEID}= req.body
        // console.log(req.body)
        crudDichvu.edit_crudService(Infoservice,OFFICEID)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
    
    }
