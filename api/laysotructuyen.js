//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const laysotructuyen = require('../database/sql-laysotructuyen');
    const nodemailer = require('nodemailer');
    const xoauth2 = require('xoauth2')
    let Infosendmail={}
    let controlmail={}
   
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
       let {control,Info}=req.body.obj
       Infosendmail=Info
       controlmail=control
       const token = require('./token');
       const scopes = [
        'https://mail.google.com/',
        // 'https://www.googleapis.com/auth/gmail.modify',
        // 'https://www.googleapis.com/auth/gmail.compose',
        // 'https://www.googleapis.com/auth/gmail.send',
      ];
      token.authenticate(scopes)
      .then( result => res.send(JSON.stringify([{ control:"ok"}])))
      .catch(err => {
        console.log(err)
        res.send(JSON.stringify([{ control:"noOk"}]));
      })
       
     });

    app.get('/oauth2callback',jsonParser, async function (req, res) {
        const {google} = require('googleapis');
        const token = require('./token');
        const url = require('url');
        const querystring = require('querystring');
        const qs = querystring.parse(url.parse(req.url).query);
        const {tokens} = await token.oAuth2Client.getToken(qs.code);
        token.oAuth2Client.credentials = tokens;
    
        const gmail = google.gmail({
            version: 'v1',
            auth: token.oAuth2Client,
          });
            // You can use UTF-8 encoding for the subject using the method below.
            // You can also just use a plain string if you don't need anything fancy.
            const subject = '🤘 Hello 🤘';
            const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
            const messageParts = [
              'From: Phan mem xep hang <nguyentoan2984@gmail.com>',
              'To:'+ String(controlmail.email),
              'Content-Type: text/html; charset=utf-8',
              'MIME-Version: 1.0',
              `Subject: ${utf8Subject}`,
              '',
              `
              <div>
              <div><h1>Kết quả đăng ký cấp số trực tuyến của quý khách</h1></div>
              <div><b> Số phiếu thứ tự    : ${String(Infosendmail.number)} </b></div> 
              <div><b> Số serial xác thực : ${String(Infosendmail.serial)} </b></div> 
              <div><b> Giao dịch dư kiến  : ${String(Infosendmail.timeGiaodich)} </b></div> 
              <div><b> Điểm giao dịch     : ${String(Infosendmail.diemGiaodich)} </b></div> 
              <div><b> Địa chỉ giao dịch  : ${String(Infosendmail.diachiGiaodich)} </b></div> 
              <div><b> Họ tên khách hàng  : ${String(Infosendmail.nameCustomer)} </b></div> 
              <div><b> Địa chỉ khách hàng : ${String(Infosendmail.addressCustomer)} </b></div> 
              <div><b> Cmnd               : ${String(Infosendmail.cmndCustomer)} </b></div> 
              </div>` ,
            ];
            const message = messageParts.join('\n');
          
            // The body needs to be base64url encoded.
            const encodedMessage = Buffer.from(message)
              .toString('base64')
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=+$/, '');
          
            const result = await gmail.users.messages.send({
              userId: 'me',
              requestBody: {
                raw: encodedMessage,
              },
            });
          if(result.statusText==="OK")
          {
            res.send("gửi email thành công")
          } else{
            res.send("gửi email không thành công")
          }
        
    });
                 
    }