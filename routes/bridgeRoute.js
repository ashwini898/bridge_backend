const express = require("express")
const config  = require("../config")
const bridgeController = require("../controllers/bridgeController")
const route = express.Router()
route.post("/deposit/:network",bridgeController.bridgeController)
route.post("/approve/:type",bridgeController.approve_controller)
route.post("/withdrawal/:widhdrawalType",bridgeController.widthdrawalController)
module.exports= route;