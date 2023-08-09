const config = require("../config");
const dotenv = require("dotenv");
const { blindUtxo } = require("../listener/aval_deposit");
const { param } = require("../routes/bridgeRoute");
const assertTransfer = require("../rgbTransfer");
dotenv.config();

// export const avaltopoly = "/exchange/avaltopoly"

async function bridgeController(req, res) {
  const path = req.params.network;
  const { address, amount, rgbAddress, user } = req.body;
  if (path == "avaltopoly") {
    const depositData = await config.aval_deposit(address, amount);
    return res.status(200).json({
      to: process.env.BRIDEADDRESS_AVAL,
      amount: amount,
      depositData: depositData,
    });
  } else if (path == "polytoaval") {
    const depositData = await config.poly_deposit(address, amount);
    return res.status(200).json({
      to: process.env.BRIDEADDRESS_POLY,
      amount: amount,
      depositData: depositData,
    });
  } else if (path == "avaltorgb") {
    config.receiver_wallet = rgbAddress;
    config.receiver_amount = (parseInt(amount) / 100) * 99;
    const depositData = await config.aval_deposit(address, amount);
    config.blinded_UTXO_address = blindUtxo;
    return res.status(200).json({
      to: process.env.BRIDEADDRESS_AVAL,
      amount: amount,
      depositData: depositData,
    });
  } else if (path == "polytorgb") {
    config.receiver_wallet = rgbAddress;
    const depositData = await config.poly_deposit();
    return res.status(200).json({
      to: process.env.BRIDEADDRESS_POLY,
      amount: amount,
      depositData: depositData,
    });
  } else {
    res.status(400).json({
      message: "Not Found",
    });
  }
}

async function approve_controller(req, res) {
  const { address, amount } = req.body;
  if (req.params.type == "avalanche") {
    const approveData = await config.aval_appprove(amount);
    console.log(approveData);
    res.status(200).json({
      from: address,
      to: process.env.AVAL_TOKEN_ADDRESS,
      approveData: approveData,
    });
  } else if (req.params.type == "polygon") {
    const approveData = await config.poly_approve(amount);
    console.log(approveData);
    res.status(200).json({
      from: address,
      to: process.env.POLY_TOKEN_ADDRESS,
      approveData: approveData,
    });
  } else {
    res.status(404).json({
      message: "Not valid request",
      validUrl: "/approve/avalanche  or /approve/polygon",
    });
  }
}

async function widthdrawalController(req, res) {
  const widthdrawalType = req.params.widhdrawalType;
 
  const { destinationAddress, amount, rgbWalletAddress } = req.body;

  if (widthdrawalType == "avalanche") {
    const status = await config.poly_withdrawal(destinationAddress, amount);
    if (status.transaction == true) {
      res.status(200).json({
        transaction: "true",
        msg: `from Avalanche to polygon ${amount} transfer to ${destinationAddress} `,
      });
    } else {
      res.status(500).json({
        transaction: false,
        msg: "Transfer Fail",
      });
    }
  } else if (widthdrawalType == "polygon") {
    const status = await config.aval_withdrawal(destinationAddress, amount);
    if (status.transaction == true) {
      res.status(200).json({
        transaction: "true",
        msg: `from Avalanche to polygon ${amount} transfer to ${destinationAddress} `,
      });
    } else {
      res.status(500).json({
        transaction: false,
        msg: "Transfer Fail",
      });
    }
  } else if(widthdrawalType=="rgb") {
    const status = await assertTransfer(rgbWalletAddress, amount);
    if (status?.transaction == true) {
      res.status(200).json({
        transaction: "true",
        msg: `from Avalanche to rgb ${amount} transfer to ${rgbWalletAddress} `,
        data:status.data
      });
    } else {
      res.status(200).json({
        transaction: false,
        msg: "Transfer Fail",
        data:status.data
      });
    }
  }else{
    res.status(404).json({
      mag:"NOT_FOUNT"
    })
  }
}
module.exports = {
  bridgeController,
  approve_controller,
  widthdrawalController,
};
