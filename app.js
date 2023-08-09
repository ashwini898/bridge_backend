const express = require("express");
const rgbTran = require("./utility/rgbTransfer")
const bridgeRoute = require("./routes/bridgeRoute");
const config = require("./config");
const polygonListener = require("./listener/poly_deposit");
const avalancheListener = require("./listener/aval_deposit");
const cors = require("cors");
const socket = require("./notificationWebsocket")
const PORT = process.env.PORT || 9000;
const app = express();

//Global middleware
app.use(cors());
app.use(express.json());

//initialize the config file
config.initialize();

// // polygon listener
// polygonListener();

// // Avalanche listener
// avalancheListener();


app.use("/", bridgeRoute);

app.listen(PORT,() => {
  console.log(`Server running port number ${PORT}`);
});
