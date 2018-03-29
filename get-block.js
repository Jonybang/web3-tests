var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const account = require('./account');

var tx = web3.eth.getBlock(601713)
.then(function(receipt){
    console.log(receipt);
});
