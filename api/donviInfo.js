//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const donviInfo = require('../database/sql-donviInfo');
   
    app.get('/donviInfo',checkApi, function (req, res) {
        donviInfo.get_donviInfo()
        .then(result => {
            console.log(result.recordset)
            res.send(JSON.stringify(result.recordset))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify({ control:"noOk"}));
           
        });
     });

     app.post('/donviInfo',jsonParser,checkApi, function (req, res) {
        let {OFFICEID}= req.body.selectedOption
         console.log(OFFICEID)

                    donviInfo.get_officeServiceInfo(OFFICEID)
                    .then(result => {
                        // console.log(result.recordset)
                        res.send(JSON.stringify(result.recordset))
                        })
                    .catch(err => {
                        console.log(err)
                        res.send(JSON.stringify({ control:"noOk"}));
                       
        });
    });

        app.post('/counter',jsonParser,checkApi, function (req, res) {
            let {SERVICEID}= req.body.selectedOption
            let {OFFICEID}= req.body
            //  console.log(OFFICEID)
                        donviInfo.get_counterService(SERVICEID,OFFICEID)
                        .then(result => {
                            // console.log(result.recordset)
                            res.send(JSON.stringify(result.recordset))
                            })
                        .catch(err => {
                            console.log(err)
                            res.send(JSON.stringify({ control:"noOk"}));
                         });
               });
               app.post('/staffs',jsonParser, function (req, res) {
                let {COUNTERID}= req.body.selectedOption
                let {OFFICEID}= req.body
                let {TABLE}= req.body
                //  console.log(req.body)
                            donviInfo.get_staffsOffice(COUNTERID,OFFICEID,TABLE)
                            .then(result => {
                                // console.log(result.recordset)
                                res.send(JSON.stringify(result.recordset))
                                })
                            .catch(err => {
                                console.log(err)
                                res.send(JSON.stringify({ control:"noOk"}));
                             });
                   });
                   app.put('/staffs',jsonParser, function (req, res) {
                    let {COUNTERID}= req.body
                    let {OFFICEID}= req.body
                    let {arrayUpdate}= req.body
                    let {TABLE}= req.body
                    //  console.log(arrayUpdate)
                                donviInfo.update_staffs(OFFICEID,COUNTERID,arrayUpdate,TABLE)
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