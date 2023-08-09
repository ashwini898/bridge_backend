const dotenv = require("dotenv");
const ethers = require("ethers");
const brideABI = require("./abis/brideapis");
const tokenABI = require("./abis/tokenabi");
const BigNumber = require("bignumber.js");
dotenv.config();

//Avalanche rpc and websocket
const aval_rpc_api = process.env.AVALNCHERPC;
const aval_websocket_api = process.env.AVAL_WEBSOCKET_API;
const aval_bridge_add = process.env.BRIDEADDRESS_AVAL;
const aval_token_add = process.env.AVAL_TOKEN_ADDRESS;

//Polygon  rpc and websocket
const poly_rpc_api = process.env.POLYGONRPC;
const poly_websocket_api = process.env.POLY_WEBSOCKET_API;
const poly_bridge_add = process.env.BRIDEADDRESS_POLY;
const poly_token_add = process.env.POLY_TOKEN_ADDRESS;

//private key of ower
const private_key = process.env.privateKey;

class Config {
  constructor() {
    this.message=null
    this.receiver_wallet = null;
    this.receiver_amount=null;
    this.avalRpcContract = null;
    this.avalWebsocketContract = null;
    this.avalWallet = null;
    this.polyRpcContract = null;
    this.polyWebsocketContract = null;
    this.polyWallet = null;
    this.avalTokenContract = null;
    this.polyTokenContract = null;

    // Call the initialization method upon instantiation
  }

  initialize() {
    const avalRpcProvider = new ethers.providers.JsonRpcProvider(aval_rpc_api);
    const avalWebsocketProvider = new ethers.providers.WebSocketProvider(
      aval_websocket_api
    );
    this.avalRpcContract = new ethers.Contract(
      aval_bridge_add,
      brideABI,
      avalRpcProvider
    );
    this.avalWebsocketContract = new ethers.Contract(
      aval_bridge_add,
      brideABI,
      avalWebsocketProvider
    );
    const polyRpcProvider = new ethers.providers.JsonRpcProvider(poly_rpc_api);
    const polyWebsocketProvider = new ethers.providers.WebSocketProvider(
      poly_websocket_api
    );
    this.polyRpcContract = new ethers.Contract(
      poly_bridge_add,
      brideABI,
      polyRpcProvider
    );
    this.polyWallet = new ethers.Wallet(private_key, polyRpcProvider);
    this.avalWallet = new ethers.Wallet(private_key, avalRpcProvider);
    this.polyWebsocketContract = new ethers.Contract(
      poly_bridge_add,
      brideABI,
      polyWebsocketProvider
    );
    this.avalTokenContract = new ethers.Contract(
      aval_token_add,
      tokenABI,
      avalRpcProvider
    );
    this.polyTokenContract = new ethers.Contract(
      poly_token_add,
      tokenABI,
      polyRpcProvider
    );
  }

  async aval_deposit(destinationAddress, amount, blinded_UTXO_address, receiver_wallet) {
    try {
      const amount18Decimals = new BigNumber(amount).times(
        new BigNumber(10).pow(18)
      );
      const depositData = this.avalRpcContract.interface.encodeFunctionData(
        "deposit",
        [destinationAddress, amount18Decimals.toString()]
      );

      return depositData;
    } catch (err) {
      console.log(err);
    }
  }

  async poly_deposit(destinationAddress, amount) {
    try {
      const amount18Decimals = new BigNumber(amount).times(
        new BigNumber(10).pow(18)
      );
      const depositData = this.polyRpcContract.interface.encodeFunctionData(
        "deposit",
        [destinationAddress, amount18Decimals.toString()]
      );
      return depositData;
    } catch (err) {
      console.log(err);
    }
  }

  async aval_withdrawal(destinationAddress, amount) {
    const status = {
      message: "",
      transaction: false,
    };
    try {
      const contractWithSigner = this.avalRpcContract.connect(this.avalWallet);
      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const depositTx = await contractWithSigner.withdraw(
        destinationAddress,
        parsedAmount,
        { gasLimit: 500000 }
      );
      await depositTx.wait();
      status.message = `Withdrawal to ${destinationAddress} successfull...`;
      status.transaction = true;
    } catch (err) {
      status.message = err;
      status.transaction=false
    }
    return status;
  }

  async poly_withdrawal(destinationAddress, amount) {
    const status = {
      message: "",
      transaction: false,
    };
    try {
      const contractWithSigner = this.polyRpcContract.connect(this.polyWallet);
      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const depositTx = await contractWithSigner.withdraw(
        destinationAddress,
        parsedAmount,
        { gasLimit: 500000 }
      );
      await depositTx.wait();
      status.message = `Withdrawal to ${destinationAddress} successfull...`;
      status.transaction = true;
    } catch (err) {
      status.message = err;
      status.transaction=false
    }
    return status;
  }

  async aval_appprove(amount) {
    try {
      const balance =  await this.avalTokenContract.balanceOf("0x00B8699990cb3B5E1ABf84989dFa6f50ba17Ec91")
      console.log("162",balance.toString());
      const approveData = this.avalTokenContract.interface.encodeFunctionData(
        "approve",
        [aval_bridge_add, amount]
      );
      return approveData;
    } catch (err) {
      console.log(err);
    }
  }

  async poly_approve(amount) {
    try {
      const polyData = this.polyTokenContract.interface.encodeFunctionData(
        "approve",
        [poly_bridge_add, amount]
      );
      return polyData;
    } catch (err) {
      console.log(err);
    }
  }
}

const config = new Config();

module.exports = config;
