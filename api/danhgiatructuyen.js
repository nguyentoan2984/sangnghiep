//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const danhgiatructuyen = require('../database/sql-danhgiatructuyen');
   
    app.get('/rating/:code', function (req, res) {
         let {code}= req.params
        // console.log(code)
        danhgiatructuyen.get_ratingInfo(code)
        .then(result => {
            // console.log(result)
            res.send(JSON.stringify(result))
            })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
     });
     app.post('/rating/',jsonParser, function (req, res) {
        let updateRating= req.body
    //    console.log(updateRating)
       danhgiatructuyen.update_ratingInfo(updateRating)
       .then(result => {
           // console.log(result)
           res.send(JSON.stringify([{ control:"Ok"}]));
           })
       .catch(err => {
           console.log(err)
           res.send(JSON.stringify([{ control:"noOk"}]));
       });
    });

    
    }
