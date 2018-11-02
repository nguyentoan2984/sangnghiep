  //////////////// nguyen toan
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
        accessToken:"ya29.Gl5GBjdPuWGNxVSFFp79RUepBpyVwMCIowW6iLnf9oNrbJM-AksHImcNgo09nvPgKWjmR0OK859S4YoW0Lw9DhDmdFwOx8Z0ch0WBKE8H9KHY3ZpHlCiFU9XRKdtIZsY"
    }
});

let mailOptions = {
    from: `${String(control.email)} 👻 <${String(control.email)}>`, // sender address
    to: String(control.email), // list of receivers
    subject: 'Hello ✔', // Subject line
    // text: String(Info), // plain text body
    html: `
    <div>
    <div><h1>Kết quả đăng ký cấp số trực tuyến của quý khách</h1></div>
    <div><b> Số phiếu thứ tự    : ${String(Info.number)} </b></div> 
    <div><b> Số serial xác thực : ${String(Info.serial)} </b></div> 
    <div><b> Giao dịch dư kiến  : ${String(Info.timeGiaodich)} </b></div> 
    <div><b> Điểm giao dịch     : ${String(Info.diemGiaodich)} </b></div> 
    <div><b> Địa chỉ giao dịch  : ${String(Info.diachiGiaodich)} </b></div> 
    <div><b> Họ tên khách hàng  : ${String(Info.nameCustomer)} </b></div> 
    <div><b> Địa chỉ khách hàng : ${String(Info.addressCustomer)} </b></div> 
    <div><b> Cmnd               : ${String(Info.cmndCustomer)} </b></div> 
    </div>` 
    // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        
        return res.send(JSON.stringify([{ control:"noOk"}]));
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.send(JSON.stringify([{ control:"ok"}]));
});

///////////// xác thực login ok/////////////        
// transporter.verify(function(error, success) {
//     if (error) {
//          console.log(error);
//          return res.send(JSON.stringify([{ control:"noOk"}]));
//     } else {
//         return res.send(JSON.stringify([{ control:"noOk"}]));
//          console.log('Server is ready to take our messages');
//     }
//  });