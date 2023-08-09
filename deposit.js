const { ethers } = require("ethers");
const dotenv = require("dotenv");
const brideABI = require("./abis/brideapis");
const tokenAbi = require("./abis/tokenabi")
dotenv.config();

const providerUrl = process.env.AVALNCHERPC;
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const contractAddress = process.env.BRIDEADDRESS_AVAL;
const contract = new ethers.Contract(contractAddress, brideABI, provider);
const tokenContract = new ethers.Contract(process.env.TOKEN_ADDRESS,tokenAbi,provider)
const privateKey = process.env.privateKey; // Replace with the private key of your wallet
const wallet = new ethers.Wallet(privateKey, provider);

async function depositToContract() {
  try {
    const contractWithSigner = contract.connect(wallet);
    // Call the contract's deposit method
    const depositTx = await contractWithSigner.deposit("0xfcc3FDc2960c0De1FAf45c5A8a40267Cfd067E1b", 10,{ gasLimit: 500000 });
    await depositTx.wait();

    console.log("Deposit successful!");
  } catch (error) {
    console.error("Error depositing to contract:", error);
  }
}
async function approveContract(){
  try{
    const contractWithSigner = tokenContract.connect(wallet);
    const approveContract = await contractWithSigner.approve(contractAddress,10)
    await approveContract.wait();
    console.log("Approve succesfully....")
  }catch (err){
    console.log("Token Contract : ",err)
  }
}


depositToContract()
// approveContract().then(()=>{}).catch((err)=>{console.log(err)})

// Usage example: depositToContract("0xDESTINATION_ADDRESS", ethers.utils.parseUnits("10", 18));
