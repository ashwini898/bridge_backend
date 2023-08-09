const config = require("../config");
const ethers = require("ethers");
const events = require("../events/widthdrawalEvent");
const axios = require('axios');
const rgbTransfer = require("../rgbTransfer")
async function depositListener() {
  console.log("Polygon  Listener Stated....");
  config.polyWebsocketContract.on(
    "Deposit",
    async (sourceAddress, destinationAddress, amount, event) => {
      if(config.receiver_wallet==null){
        config.aval_withdrawal(destinationAddress,amount)
      }else{
        rgbTransfer(config.receiver_wallet,amount)
      }
    });
  }

  module.exports=depositListener
















































