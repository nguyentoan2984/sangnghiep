//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const crudDonvi = require('../database/sql-crudDonvi');
   
    app.get('/crudDonvi/',checkApi, function (req, res) {
        crudDonvi.get_crudDonvi()
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });

     app.post('/crudDonvi/',jsonParser,checkApi, function (req, res) {
        let {InfoDonvi}= req.body
       
        crudDonvi.add_crudService(InfoDonvi)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });

     app.delete('/crudDonvi/:officeidDelete/',jsonParser,checkApi, function (req, res) {
        let {officeidDelete}= req.params
     
        crudDonvi.delete_crudDonvi(officeidDelete)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
     
     app.put('/crudDonvi/',jsonParser,checkApi, function (req, res) {
        let {InfoDonvi}= req.body
      
        crudDonvi.edit_crudDonvi(InfoDonvi)
        .then(result => {
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
    
    }
