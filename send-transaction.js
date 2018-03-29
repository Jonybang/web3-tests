var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//web3.eth.isSyncing().then(console.log);

web3.eth.getGasPrice().then(function(gasPrice){

const account = require('./account');

web3.eth.personal.unlockAccount(account, "123").then(function(response){

console.log('unlockAccount', response);
console.log('gasPrice', gasPrice);
web3.eth.sendTransaction({
    from: account,
        gas: 21000,
        gasPrice: gasPrice,
    to: '0xD23f973c91B3aBF8D3DAf7620389800Fd27CabD1',
    value: '56000000000000000'
})
.then(function(receipt){
    console.log(receipt);
})
.catch(function(err){
	console.log('err',err);
});

});
});
