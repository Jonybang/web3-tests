var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = function(){
	return web3.eth.getGasPrice().then(function(gasPrice){
		gasPrice = parseInt(gasPrice) || '1000000000';
		return gasPrice.toString();
	});
}
