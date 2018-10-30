//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const laysotructuyen = require('../database/sql-laysotructuyen');
    const nodemailer = require('nodemailer');
    const xoauth2 = require('xoauth2')
   
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
     app.post('/sendNumber',jsonParser, function (req, res) {
      
        let{control,Info}=req.body.obj
        console.log(req.body)
        let nook ={ control:"noOk" };
        let ok ={ control:"Ok" };
      
      
       let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: "hethong1phut30giay@gmail.com",
            clientId: "291461678056-sthb58jupg8snc11h2uk2at75m0svajn.apps.googleusercontent.com",
            clientSecret: "K2l4PWM0O_AzTuJnq1GWy7FZ",
            refreshToken: "1/XBdSPt4uob2UMNYq0UJzLPAHSsKtB4HKtX8SDT7U_is",
            accessToken:"ya29.GltGBg2YF_6qnMle1Jj74TahR_nYjHiqyJIXQI6FfrWHhUMt_u-W2Xht0No5arjFDkhYmJCmRWQx1byW7x7DHZQOZOMfKc3U99XA-83YaFsZClQI5UmjIOwZ-2Py"
        }
    });
       
                // let transporter = nodemailer.createTransport({
                //     service: 'gmail',
                //     auth: {
                //             xoauth2: xoauth2.createXOAuth2Generator({
                //             user: "hethong1phut30giay@gmail.com",
                //             clientId: "291461678056-sthb58jupg8snc11h2uk2at75m0svajn.apps.googleusercontent.com",
                //             clientSecret: "K2l4PWM0O_AzTuJnq1GWy7FZ",
                //             refreshToken: "1/XBdSPt4uob2UMNYq0UJzLPAHSsKtB4HKtX8SDT7U_is",
                //             accessToken:"ya29.GltGBg2YF_6qnMle1Jj74TahR_nYjHiqyJIXQI6FfrWHhUMt_u-W2Xht0No5arjFDkhYmJCmRWQx1byW7x7DHZQOZOMfKc3U99XA-83YaFsZClQI5UmjIOwZ-2Py"
                //      })
                //     }
                // });
      

                let mailOptions = {
                    from: '"hethong1phut30giay 👻" <hethong1phut30giay@gmail.com>', // sender address
                    to: "nguyentoan2984@gmail.com", // list of receivers
                    subject: 'Hello ✔', // Subject line
                    // text: String(Info), // plain text body
                    html: `
                    <div>
                    <<h1>Kết quả đăng ký cấp số trực tuyến của quý khách</h1>
                    <div><b> Số phiếu thứ tự :' + String(Info.number)+'</b></div> 
                    
                    </div>` 
                  
                    
                    
                    // html body
                };
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });

        ///////////// xác thực login ok/////////////        
                // transporter.verify(function(error, success) {
                //     if (error) {
                //          console.log(error);
                //     } else {
                        
                //          console.log('Server is ready to take our messages');
                //     }
                //  });
       
     });


   

      
                 
    }