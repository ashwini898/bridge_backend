const config = require("../config");
const ethers = require("ethers");
const events = require("../events/widthdrawalEvent");
const axios = require('axios');
const rgbTransfer=require("../rgbTransfer")
async function depositListener() {
  console.log("Avalanche  Listener Stated....");
  config.avalWebsocketContract.on(
    "Deposit",
    async (sourceAddress, destinationAddress, amount, event) => {
      console.log("HEllo............")
      if(config.receiver_wallet==null){
        console.log("Calling transfer Poly withdrawal...")
        config.poly_withdrawal(destinationAddress,amount)
      }else{
        console.log("Calling transfer ...")
        rgbTransfer(config.receiver_wallet,config.currentUser)

      }
    }
  );
}


module.exports = depositListener
