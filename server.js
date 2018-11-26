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
const danhgiatructuyen = require('./api/danhgiatructuyen');
danhgiatructuyen(app,jsonParser,checkApi);
const crudDichvu = require('./api/crudDichvu');
crudDichvu(app,jsonParser,checkApi);
const crudDonvi = require('./api/crudDonvi');
crudDonvi(app,jsonParser,checkApi);
const phanquyenUser = require('./api/phanquyenUser');
phanquyenUser(app,jsonParser,checkApi);
const chatbotfacebook = require('./api/chatbotfacebook');
chatbotfacebook(app,jsonParser,checkApi);

const admin = require('./api/admin');
admin(app,jsonParser,urlparser,checkApi,sign,SK);
/// route
app.get('/', (req, res) =>{
    res.render('capsotructuyen');
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






