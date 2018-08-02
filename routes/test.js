var express = require('express');
var router = express.Router();

var Client = require('node-rest-client').Client;
 
var client = new Client();
var conversationID = "holis";


var args = {
    data: { from: "mar", text: "hola", type: "message" },
    headers: { "Content-Type": "application/json", "Authorization": "Bearer UXfjuxJwKgg.cwA.cYo.EXRcORb0XwBIBkBjvLFMjW8EqcOhukov-9FR_GcT4Fw" }
};



client.post("https://directline.botframework.com/v3/directline/conversations", args, function (data, response) {
    // console.log(data);   
    conversationID = data.conversationId;
    // console.log("cnvId: "+conversationID)
});

function sendMessage(input, callback) {
    var args2 = {
        data: { from: {id: conversationID}, text: input, type: "message" },
        headers: { "Content-Type": "application/json", "Authorization": "Bearer UXfjuxJwKgg.cwA.cYo.EXRcORb0XwBIBkBjvLFMjW8EqcOhukov-9FR_GcT4Fw" }
    };
    client.post(`https://directline.botframework.com/v3/directline/conversations/${conversationID}/activities`, args2, function (data, response) {
  
    callback(data);
});
}

function getMessage(input, callback) {
    var args3 = {
        data: { from: {id: conversationID}, text: input, type: "message" },
        headers: { "Content-Type": "application/json", "Authorization": "Bearer UXfjuxJwKgg.cwA.cYo.EXRcORb0XwBIBkBjvLFMjW8EqcOhukov-9FR_GcT4Fw" }
    };
    client.get(`https://directline.botframework.com/v3/directline/conversations/${conversationID}/activities`, args3, function (data, response) {
        callback(data);
    });
}

/* GET test listing. */
router.get('/', function(req, res, next) {
    var promise1 = new Promise(function(resolve, reject) {
        data = sendMessage(req.query.message, function(data){
            if(data) {
                // console.log("resolve")
                resolve(data);
            } else{
                // console.log("reject")
                reject(data);
            }
        });
    });
    promise1.then(function(data) {
        data = getMessage(req.query.message, function(data){
            // console.log(data.activities[1].text)
            res.json(data.activities[Object.keys(data.activities).length-1].text)
            // res.send(req.query.message);
        });
      }, function(err) {
        console.log(err); // Error: "It broke"
      });
    
});

module.exports = router;