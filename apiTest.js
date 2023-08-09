// const axios = require('axios')
const fetch = require("node-fetch").default;
const body ={
    wallet_address_from:"bcrt1qdppsjpkq8xgxgzftysly7yst3g0mj3rg7dh2yp",
   amount_to_transfer:"10",
   asset_ID:"rgb19m7m79pfc85r7ek04qd7fj9pj0x5g0mrwrcw3fr5ka8td0flxplqlq7ydw",
   blinded_UTXO_address:"txob160gx7w79ad4yqrgwmf2aj85kchcmls7078fsavwfk0zy0uty9uas0k84sz"
  }


  async function makeApi(){
     try{
        const res = await fetch("http://127.0.0.1:5000/transfer_assets",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
              body:JSON.stringify(body),
        })
       const data = await res.json();

     }catch (err){
        console.log(err)
     }
  }

  makeApi()