
const fetch = require("node-fetch").default;
const bashURL = "http://172.19.0.5:5000/"
const transferBody =  {
        wallet_address_from:"bcrt1q4v6mptygrzn9vshxjrsk6p8e5n3h586ew09vu3",
        amount_to_transfer:0,
        asset_ID:"rgb13uy6r5kpy80eay2crlk3uc4v0qxp5jtx5a2gw3lu5j2ydzu60zesf57uyz",
        blinded_UTXO_address:null
}

async function assertTransfer(recieverAddress,amount){
    const blindApiResponse = await postCall("prepare_blinded_UTXOs",{"wallet_address":recieverAddress})
    if(blindApiResponse.data.status !='ok'){
        return console.log("ERROR",blindApiResponse.data.msg)
    }

    transferBody.amount=parseInt(amount);
    transferBody.blinded_UTXO_address=blindApiResponse.data.blinded_UTXO
    const transferResponse = await postCall("transfer_assets",transferBody)
    if(transferResponse.data.status !='ok'){
        return console.log("Error transferResponse",transferResponse.data.msg)
    }
    
    const refreshReciever = await postCall("refresh_transfer",{"wallet_address":recieverAddress});

    if(refreshReciever.data.status !='ok'){
        return console.log("Error refreshReciever",refreshReciever.data.msg)
    }

    const refreshSender = await postCall("refresh_transfer",{"wallet_address":transferBody.wallet_address_from})

    if(refreshSender.data.status !='ok'){
        return console.log("Error refreshSender",refreshSender.data.msg)
    }

    const recievedAssert = await postCall("list_transfer_assets",{"wallet_address":recieverAddress,"asset_ID":transferBody.asset_ID})

    if(recievedAssert.data.status !='ok'){
        return console.log("Error recievedAssert",recievedAssert.data.msg)
    }

    console.log(recievedAssert);

}


async function postCall(path,body) {

    try{
        const data = await fetch(bashURL+path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        const res = await data.json();
        return res;
    }catch (err) {
        console.log(err);
    }
}

