const express = require('express');
const parser=require('body-parser');
const urlparser =parser.urlencoded({ extended: false });
const jsonParser = parser.json();
const { sign, verify } = require('jsonwebtoken');
const SK = 'qwaszx@#&&#@polkmn';
const cookieParser = require('cookie-parser');
const moment = require('moment');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2')
const svgCaptcha = require('svg-captcha');

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));

function userIsAllowed(callback) {
    // this function would contain your logic, presumably asynchronous,
    // about whether or not the user is allowed to see files in the
    // protected directory; here, we'll use a default value of "false"
    callback(false);
  };
  // This function returns a middleware function
var protectPath = function(regex) {
    return function(req, res, next) {
      if (!regex.test(req.url)) { return next(); }
      userIsAllowed(function(allowed) {
        if (allowed) {
          next(); // send the request to the next handler, which is express.static
        } else {
          res.end('You are not allowed!');
        }
      });
    };
  };
  
app.use(protectPath(/^\/public\/.*$/));

const checkApi = (req, res, next) => {
    let nook ={ control:"api" };
    const { token } = req.cookies;
    if (!token) return          res.send(JSON.stringify({ nook }));
    verify(token, SK, (err, obj) => {
        if (err) return           res.send(JSON.stringify({ nook }));
        const { username } = obj;
        sign({ username }, SK, { expiresIn: 600*5*100 }, (errSign, token) => {
            res.cookie('token', token);
            next();
        });
    }) ;
}

/// route
const donviInfo = require('./api/donviInfo');
donviInfo(app,jsonParser,checkApi);
const giamsatDichvu = require('./api/giamsatDichvu');
giamsatDichvu(app,jsonParser,checkApi);
const giamsatNhanvien = require('./api/giamsatNhanvien');
giamsatNhanvien(app,jsonParser,checkApi);
const canhbao = require('./api/cauhinhCanhbao');
canhbao(app,jsonParser,checkApi);
const laysotructuyen = require('./api/laysotructuyen');
laysotructuyen(app,jsonParser,checkApi);
/// route
app.get('/', (req, res) =>{
    res.render('capsotructuyen');
  });

app.get('/admin', (req, res) =>{
  res.render('signin');
});
app.post('/admin',urlparser, (req, res) =>{
    let {username,password}=req.body;
    let nook ={ control:"noOk" };
    let ok ={ control:"Ok" };
    console.log(req.body)
    if(username=="admin" && password==123456)
    
            sign({username}, SK, { expiresIn: 60*5*100 }, (err, token) => {
                            res.cookie('token', token);
                            res.render('quangtripages')
                          });
        else {
            res.send(" username hoặc mật khẩu không đúng")
        }
});


app.post('/sendEmail',urlparser, (req, res) =>{
    let {email}=req.body;
    let nook ={ control:"noOk" };
    let ok ={ control:"Ok" };
    console.log(email)
    
   let account={
       user:'hethong1phut30giay@gmail.com',
       pass:'thanfood125127'
   }
   
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                        xoauth2: xoauth2.createXOAuth2Generator({
                        user: "nguyentoan2984@gmail.com",
                        clientId: "933488381257-o63gbaa7qgv0spv9n5l0jso2j776s7ol.apps.googleusercontent.com",
                        clientSecret: "Hht_O1T5q8e-9jY6FHS9QZIQ",
                        // refreshToken: ""
                 })
                }
            });
  
            let mailOptions = {
                from: '"hethong1phut30giay 👻" <hethong1phut30giay@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>' // html body
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
    
    //  quanly.changePassword(user,passwordOld,passwordNew)
    // .then( () => {
    //     res.send(JSON.stringify( {ok} ));
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.send(JSON.stringify({nook}));
    // });
});



///////////////////// Tri Luat///////////////////////
app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    // req.session.captcha = captcha.text;
    res.type('svg');
    // res.status(200).send(captcha.data);
    res.send(JSON.stringify( {captcha} ));
    // console.log(captcha.data);
});


app.get('*', (req, res) => {
    // res.render('404');
   res.send("ko co trang tồn tại")
});






