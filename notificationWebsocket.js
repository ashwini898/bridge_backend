const ws = require('ws')
const { map } = require('./abis/brideapis');
const { json } = require('express'); 

let userIdentifier = new Map();

function sendWebSocketMessage(client,eventType,message){
    if(client.readyState=== ws.OPEN){
        const data = JSON.stringify({type:eventType,message:message})
        client.send(data)
    }
}

function setupWebSocketServer(port){
    console.log("Websocket is runing",port)
    const wss  = new ws.Server({port:port});
    wss.on("connection",(ws,req)=>{
        const userId = new URLSearchParams(req.url.slice(1)).get('userId')
        console.log("on called",userId)
        if(userId){
            userIdentifier.set(userId,ws);
        }else {
            ws.close(4000,"User id not provided");
        }
    
        ws.on("close",()=>{
            if(userId){
                userIdentifier.delete(userId);
            }
        })
    })

}



function notificationOnAssertTransfer(userId,message){
    const ws = userIdentifier.get(userId)
    console.log("Called notification",userId);
    if(ws){
        sendWebSocketMessage(ws,"assertTransferCompleted",message)
    }
}


module.exports={
    notificationOnAssertTransfer,
    setupWebSocketServer
}