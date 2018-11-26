//// route trả về các array cho các toolbox xổ chọn
module.exports=function(app,jsonParser,checkApi) {  
    const donviInfo = require('../database/sql-donviInfo');
    const laysotructuyen = require('../database/sql-laysotructuyen');
    const request = require('request')
    const access_token = 'EAAYq1yyyut0BAH2QzPCYQ6ZB2bgtZBiTqc8ka3hhYx4BeSFz3ooIMhY88ZADiWBcdhibLdkIM4tBQtnNZA96HGFY2m4YwTYrrkonENl0GOUYagZA8MKWwZBEx89ZCVdbVyUZCiF2BELmd85J5OG7hQOYi3TbGfWK9qsWLgDMRy5MJYjw3kUFlgCyb7HGw82R0hIZD';
    const page_inbox_app_id = "1735953516509917";
    const verify_token = "try";
     // Accepts GET requests at the /webhook endpoint
     app.get('/webhook', (req, res) => {
        // Parse params from the webhook verification request
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === verify_token) {
                // Respond with 200 OK and challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    });
    // receives webhook events from Messenger Platform
    app.post('/webhook',jsonParser, (req, res) => {
    console.log(req.body)
        // parse messaging array
        const webhook_events = req.body.entry[0];
        // console.log(webhook_events.standby)
        // console.log(webhook_events.messaging)
        // Secondary Receiver is in control - listen on standby channel
        if (webhook_events.standby) {
    
            // iterate webhook events from standby channel
            webhook_events.standby.forEach(event => {
                handleEvent(event.sender.id, event);
            });
        }
    
        // Bot is in control - listen for messages
        if (webhook_events.messaging) {
    
            // iterate webhook events
            webhook_events.messaging.forEach(event => {
                handleEvent(event.sender.id, event);
            });
        }
    
        // respond to all webhook events with 200 OK
        res.sendStatus(200);
    
    });
    
    
    // Check event type and pass to the appropriate handler function
    function handleEvent(sender_psid, webhook_event) {
        if (webhook_event.message) {
            handleMessage(webhook_event.sender.id, webhook_event.message);
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        } else if (webhook_event.referral) {
            handleReferral(sender_psid, webhook_event.referral);
        } else if (webhook_event.pass_thread_control) {
            handlePassThreadControl(sender_psid, webhook_event.pass_thread_control);
        }
    }
    
    function handleMessage(sender_psid, received_message) {
      let response;
      let str = received_message.text + "    ";
          str = str.slice(0, 6);
     
      // Checks if the message contains text
      if (str == '[DKCS]') {    
        let stringArray=received_message.text
        stringArray=stringArray.replace("][", ",")
        stringArray=stringArray.replace("][", ",")
        stringArray=stringArray.replace("[", "")
        stringArray=stringArray.replace("]", "")
        stringArray=stringArray.split(",")
      
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        //passThreadControl(sender_psid, page_inbox_app_id)
        let SERVICEID=stringArray[1][stringArray[1].length-1]
        let OFFICEID=stringArray[1].slice(0,stringArray[1].length-1)
        let Name=stringArray[2].split("_")
        laysotructuyen.get_waitNumber(OFFICEID,SERVICEID)
        .then(result => {
            // console.log(result)
            let INFOCUSTOMERS=
            { ho: `${Name[0]}`,
             ten: `${Name[1]}`,
             diachi: null,
             email: null,
             ISSUEDFROM:"3",
             cmnd: null,
             didong: null,
             valueCaptcha: null,
             FACEBOOK:sender_psid,
             ADDRESS:result[0].ADDRESS,
             OFFICENAME:result[0].OFFICENAME,
             timeGiaodich: result[0].timeGiaodich,
             MESSAGE:`${received_message.text}`
            }
                    laysotructuyen.get_showNumber(OFFICEID,SERVICEID,INFOCUSTOMERS)
                    .then(result => {
                        console.log(result)
                        if(result[0].status=="ok")
                            {
                                response = {
                                "text": `
                                -Khách hàng :${INFOCUSTOMERS.ho} ${INFOCUSTOMERS.ten}
                 -Số thứ tự của bạn: ${result[0].number}
                 -Mã số xác thực của bạn: ${result[0].serial} 
                 -Thời gian giao dịch dự kiến: ${INFOCUSTOMERS.timeGiaodich}
                 -Văn phòng giao dịch:${INFOCUSTOMERS.OFFICENAME}
                 -Địa chỉ giao dịch:${INFOCUSTOMERS.ADDRESS}
                                   `
                                  }
                                  callSendAPI(sender_psid, response);  
                                  return
                        }
                           else  
                                response = {
                                    "text": result[0].status
                                }
                                callSendAPI(sender_psid, response);  
                                return
                        })
                        
                    .catch(err => {
                        console.log(err)
                        res.send(JSON.stringify([{ control:"noOk"}]));
                    
                    });
            })

        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
           
        });
       
        
        
        
      //test chuc nang form 
        
      // test chuc nang form  
        
      } else if (received_message.text) {
        // Get the URL of the message attachment
        //let attachment_url = received_message.attachments[0].payload.url;
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Bạn có muốn đăng ký cấp số thứ tự tại ngân hàng chúng tôi?",
                "subtitle": "Nhấn phím để chọn",
                //"image_url":attachment_url,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Yes!",
                    "payload": "yes",
                  },
                  {
                    "type": "postback",
                    "title": "No!",
                    "payload": "no",
                  },
                ],
              }]
            }
          }
        }
        callSendAPI(sender_psid, response);  
      } 
      
      // Send the response message
       
    }
    
    function handlePostback(sender_psid, received_postback) {
      let response;
      // Get the payload for the postback
      let payload = received_postback.payload;
      let arrayDonvi=[]
      // Set the response based on the postback payload
      if (payload === 'yes') {
        donviInfo.get_donviInfo()
        .then(result => {
            console.log(result.recordset)
            for (let num of result.recordset) {
              let obj={}
              let obj1={}
              obj.title="Bạn vui lòng chọn đơn vị"
              obj.subtitle="Nhấn phím để chọn"
              obj1.type="postback"
              obj1.title=num.OFFICENAME
              obj1.payload=num.OFFICEID
              obj.buttons=[obj1]
              arrayDonvi.push(obj)
            }
            response = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements":arrayDonvi
                  //  [
                  //   {
                  //   "title": "Bạn vui lòng chọn đơn vị giao dịch",
                  //   "subtitle": "Nhấn phím để chọn",
                  //   //"image_url":attachment_url,
                  //   "buttons": arrayDonvi,
                  //   },
                   
                  // ]
                }
              }
            }
            callSendAPI(sender_psid, response);
            return
         })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });
       
        
      }
       else if (payload === 'no') {
        response = { "text": "Cảm ơn bạn đã ghé thăm, hẹn gặp lại" }
        callSendAPI(sender_psid, response);
        return
      }

       else if (payload.length < 8 ) {
        let arrayDichvu=[]
        donviInfo.get_donviInfo()
        .then(result => {
            for (let num of result.recordset) {
                  if(num.OFFICEID===payload)
                    {
                      donviInfo.get_officeServiceInfo(payload)
                      .then(result => {
                         
                          for (let num of result.recordset) {
                            let obj={}
                            let obj1={}
                            obj.title="Bạn vui lòng chọn dịch vụ"
                            obj.subtitle="Nhấn phím để chọn"
                            obj1.type="postback"
                            obj1.title=num.SERVICENAME
                            obj1.payload=num.SVcode
                            obj.buttons=[obj1]
                            arrayDichvu.push(obj)
                            }
                            response = {
                              "attachment": {
                                "type": "template",
                                "payload": {
                                  "template_type": "generic",
                                  "elements":arrayDichvu
                                  //  [
                                  //     {
                                  //     "title": "Bạn vui lòng chọn dịch vụ",
                                  //     "subtitle": "Nhấn phím để chọn",
                                  //     //"image_url":attachment_url,
                                  //     "buttons":arrayDichvu.slice(0,3)
                                  //   },
                                  //  ]
                                }
                              }
                            }
                            callSendAPI(sender_psid, response);
                            console.log(arrayDichvu)
                            // return
                          })
                      .catch(err => {
                          console.log(err)
                          res.send(JSON.stringify([{ control:"noOk"}]));
                         
                      });
                    }
            }
         })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify([{ control:"noOk"}]));
        });

      } 
      else if (payload) { 
    
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": `Mã_Đơn vị của bạn là: ${payload}. Bạn gửi theo cú pháp sau để hoàn tất đăng ký.`,
                "subtitle": "[DKCS][Mã_Đơn vị][Ho_TenKH] ví dụ [DKCS][08CNHCM1][HỒ_QUỲNH HƯƠNG]"       
              }]
            }
          }
        }
        callSendAPI(sender_psid, response)
        return
      }
      
      
      // Send the message to acknowledge the postback
      // callSendAPI(sender_psid, response);
    }
    
    
    // Handles messaging_referral events
    function handleReferral(sender_psid, received_referral) {
        console.log(`PSID: ${sender_psid}, referral: ${received_referral.ref}`);
    }
    
    // Pass thread control
    function passThreadControl(sender_psid, target_app_id) {
        console.log('PASSING THREAD CONTROL');
        let request_body = {
            recipient: {
                id: sender_psid
            },
            target_app_id
        };
    
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/me/pass_thread_control",
            "qs": { "access_token": access_token },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error(`Unable to send message:${err}`);
            }
        });
    }
    
    // Sends response messages via the Send API
    function callSendAPI(sender_psid, response) {
        // Construct the message body
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        };
    
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/me/messages",
            "qs": { "access_token": access_token },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error(`Unable to send message:${err}`);
            }
        });
    }
    
    }



