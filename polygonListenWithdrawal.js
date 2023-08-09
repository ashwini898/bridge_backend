//polygonListenWithdrawal.js

const ethers = require("ethers")
const dotenv = require("dotenv");
const bridgeAbi = require("./abis/brideapis");

dotenv.config();

async function polygon_linten_withdrawal() {
  console.log("Monitering stated...")
  
  const provider = new ethers.providers.WebSocketProvider(process.env.POLY_WEBSOCKET_API);
  const contract = new ethers.Contract(process.env.BRIDEADDRESS_POLY,bridgeAbi,provider);
  contract.on('Withdraw',async (to, amount,event)=>{
    try{
       // console.log("Transaction Hash : "+event.log.transactionHash)
        const decimalAmount = ethers.utils.formatUnits(amount, 18);
        console.log("Destination Address: ",to);
        console.log("Amount: ",decimalAmount)
        console.log("...................................#.................................")
    }catch(err){
        console.log(err);
    }
  })
}



polygon_linten_withdrawal();