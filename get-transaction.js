var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const account = require('./account');

var tx = web3.eth.getTransaction("0x41361cc003a236a57569672569adaf63dbbfa93f8bc23a19485f7443cd7f7543")
.then(function(receipt){
    console.log(receipt);
});
