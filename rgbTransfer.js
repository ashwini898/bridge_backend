const fetch = require("node-fetch").default;
const config = require("./config")
const websocketNotification = require("./notificationWebsocket")
const bashURL = "http://172.19.0.5:5000/"
const mineBashUrl = "http://127.0.0.1:8000/v1/"

let transferBody =  {
        wallet_address_from:"bcrt1qzwcupl0ra8utac8tyufu2perum8lw98pw6kppw",
        asset_ID:"rgb1cj32jqkvslnfnnn7tyd8eevd8yx9pnuqsvn6hrtxnn6xpler86jse2kvht",
}

async function assertTransfer(recieverAddress,amount){
    console.log(amount,recieverAddress)
    let status = {
        transaction:false,
        msg:'',
        data:null
    }
    const blindApiResponse = await postCall("prepare_blinded_UTXOs",{"wallet_address":recieverAddress})
        console.log("20",blindApiResponse)
    if(blindApiResponse.data.status !='ok') {
        status.msg="Error while blindutxo creating"
        status.data=blindApiResponse
        return status
    }

    const transferResponse = await postCall("transfer_assets",{
        asset_ID:transferBody.asset_ID,
        wallet_address_from:transferBody.wallet_address_from,
        amount_to_transfer:parseInt(amount),
        blinded_UTXO_address:blindApiResponse.data.blinded_UTXO
    })
    console.log(transferResponse)
    if(transferResponse.data.status !='ok') {
        status.msg="Error while assert transfer.."
        status.data=transferResponse
        return status
    }
    
    const refreshReciever = await postCall("refresh_transfer",{"wallet_address":recieverAddress});

    if(refreshReciever.data.status !='ok'){
        status.msg="Error while assert transfer.."
        status.data=refreshReciever
        return status
    }


    const refreshSender = await postCall("refresh_transfer",{"wallet_address":transferBody.wallet_address_from})

    if(refreshSender.data.status !='ok') {
        status.msg="Error while assert transfer.."
        status.data=refreshReciever
        return status
    }
         


    const mineStatus = await minePost("mine",'');
    if(mineStatus.status !='ok'){
        status.msg="Error while Mine"
        status.data=mineStatus
        return status
    }

    const transferRecievar = await postCall('list_transfer_assets_confirmation',{
        wallet_address: recieverAddress,
        asset_ID: transferBody.asset_ID
    })

    if(transferRecievar.data.status != 'ok'){
        status.msg="Error while Transfer Reciever"
        status.data=transferRecievar
        return status
    }
    const transferIssuer = await postCall('list_transfer_assets_confirmation',{
        wallet_address: transferBody.wallet_address_from,
        asset_ID: transferBody.asset_ID
    })

    if(transferIssuer.data.status != 'ok'){
        status.msg="Error while Transfer Reciever"
        status.data=transferIssuer
        return status
    }
    console.log("done")
     status.transaction=true;
     status.msg="Transfer success";
     status.data=transferRecievar;
     return status
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
        return {"status":err}
    //   return  res.status(503).json({
    //         err:err
    //     })
    }
}

async function minePost(path,body){
    try{
        const data = await fetch(mineBashUrl+path, {
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
        return {"status":err}
    }
}
 module.exports = assertTransfer
